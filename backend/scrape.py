import requests
from bs4 import BeautifulSoup
from bs4.element import Comment


def get_tos(url: str) -> str:
    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')
    links = list(filter(lambda x: "privacy" in str(
        x.contents).lower(), soup.find_all('a')))
    link = list(map(lambda x: x.get("href"), links))[0]

    main_url = url.split("/")[2]
    tos_url = link
    if main_url not in link:
        tos_url = main_url = url.split(
            "/")[0] + "//" + main_url + link.replace("#", "")

    return get_text_body(tos_url)


def tag_visible(element: str) -> bool:
    if element.parent.name in ['style', 'script', 'head', 'footer',
                               'title', 'meta', '[document]']:
        return False
    if isinstance(element, Comment):
        return False
    return True


def get_text_body(url: str) -> str:
    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')
    text = soup.find_all(string=True)
    visible_texts = filter(tag_visible, text)
    actual_text = u" ".join(t.strip() for t in visible_texts)
    return actual_text[actual_text.lower().find("privacy"):]
