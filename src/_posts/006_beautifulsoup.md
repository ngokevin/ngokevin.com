---
title: "Beautiful Soup is Beautiful"
type: blog
category: blog
date: 2011-12-15
id: beautiful-soup
tags: code

image:
    url: http://www.crummy.com/software/BeautifulSoup/10.1.jpg
    where: right
---

Earlier, I wrote a [post](http://ngokevin.com/blog/20111215-sqlalchemy/) about
having to populate a table with contact information for network administrators
for secure VLANs. I had to do some housekeeping on our crusty database schema
using SQLAlchemy to accomodate a couple of new tables. Now, it was time to
populate the new firewall contact information table. A lot of the contact
information could be found on an intranet site in a nice, neat, and most
importantly scrapable table. Previously, I had been using either flat regex or
lxml to scrape web pages, but now it was time to play it smart and have a slurp
of some [Beautiful Soup](www.crummy.com/software/BeautifulSoup/), a Python HTML
parser for screen-scraping.

---

I had heard about Beautiful Soup before, but I had never gotten around to
actually playing with it. I was trying out lxml but was put off by its
confusing documentation and focus on XML rather than HTML. Boy am I glad that I
tried Beautiful Soup. It makes parsing HTML as easy as navigating through the
DOM in Javascript in terms of their similar APIs.

Obviously, I first had to make a request to the intranet site, which required
authentication. Then I had to throw that HTML response into the stew so I could
serve some delicious soup:

    import urllib2
    import base64

    opener = urllib2.build_opener()
    request = urllib2.Request("http://intranet.net.oregonstate.edu/private/firewall-contexts.php")

    # authenticate
    base64string = base64.encodestring('username:password')[:-1]
    request.add_header("Authorization", "Basic %s" % base64string)

    # request and convert to document tree
    response = opener.open(request)
    html = response.read()
    soup = BeautifulSoup(html)

Here's where it gets even easier. I simply needed to extract information from a
table. So I grabbed the table, grabbed the rows from the table, and iterated
through the rows. What was funny was that this old website had two HTML elements.

    # get rows from content table
    content = soup.findAll('html')[1] # page has two html elements
    table = content.table
    rows = table.findAll('tr')[1:] # ignore table header row

    for row in rows:
        firewall_contact = {}
        tds = row.findAll('td')

        # parse firewall context name
        context = tds[0].findAll(text=True)[0]

        # parse description
        description = tds[1].findAll(text=True)[0]

        # parse administrators
        try:
            administrators = tds[2].findAll(text=True)[0].split(',')
        except IndexError:
            pass

What was also funny was that some of the names in the table weren't their given
names. I needed the exact name so I could query for their contact information
in LDAP so I wrote a silly hard-coded function that translated names like Andy
to Andrew.

        # lookup adminstrator contact information from ldap
        info = None
        for administrator in administrators:
            name = full(administrator.strip()).split(' ')
            if len(name) == 2:
                info = ldap_search(first_name=name[0], last_name=name[1])
                if not info:
                    info = ldap_search(first_name=full(name[0]), last_name=name[1])
                if not info:
                    info = ldap_search(first_name=full(name[0], alt=True), last_name=name[1])
                if not info:
                    continue
                break
            else:
                continue

Then I just parsed the rest, threw them into a list of dictionaries, and
returned them for SQLAlchemy to have its way with them dictionaries. Nothing
like Alchemizing some Beautiful Soup in a stirring cauldron on a cold evening.

    # parse vlan ids
        vlans = []
        vlan_texts = tds[3].findAll(text=True)
        for vlan_text in vlan_texts:
            try:
                matches = vlan_regex.findall(vlan_text)[0]
                for match in matches:
                    if match:
                        vlans.append(match)
            except IndexError:
                pass

        # add firewall contact to list of firewall contacts
        for vlan in vlans:
            firewall_contact = {}
            firewall_contact['context'] = context
            firewall_contact['description'] = description
            firewall_contact['vlan_id'] = vlan
            get_ldap_info(info, firewall_contact)
            if not 'name' in firewall_contact:
                firewall_contact['name'] = administrators[0]
            firewall_contacts.append(firewall_contact)

    return firewall_contacts

If I ever have to screen-scrape flat HTML pages again, Beautiful Soup will be
my go-to parser.
