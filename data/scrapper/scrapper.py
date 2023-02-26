import urllib
import ssl
import requests
import urllib.request
from bs4 import BeautifulSoup

user_agent = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009021910 Firefox/3.0.7'

headers = {'User-Agent': user_agent, }
gcontext = ssl.SSLContext()


def make_soup(link):
    request = urllib.request.Request(link, None, headers)
    page = urllib.request.urlopen(request, context=gcontext)
    soupdata = BeautifulSoup(page, "html.parser")
    return soupdata


image_urls = []
for i in range(10):
    site = 'https://asos.com/women/tops/cat/?cid=4169&nlid=ww|clothing|shop%20by%20product&page='
    site = site + str(i)
    soup = make_soup(site)

    for img in soup.findAll('img'):
        temp = img.get('src')
        if temp is not None and "products" in temp and str(temp).startswith('//'):
            image_urls.append(temp)
            print(temp)
    print('Page ', i, ' done')

for i in range(len(image_urls)):
    filename = str(i + 1) + '_Tops'
    path = 'ASOS/Tops/' + filename
    url = 'https:' + image_urls[i]
    response = requests.get(url)
    with open(path + ".jpeg", 'wb+') as image:
        image.write(response.content)
        image.close()
