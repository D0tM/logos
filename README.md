Logos is a quick and simple, **no dependency**, javascript plugin to **improve the readibility** of your blog, it injects into the document a distraction free **reader mode** and a **font enlarger module**.

[Demo page](https://d0tm.github.io/logos/demo.html)

# Usage 

**[Font enlarger only]**

```javascript
Logos.init({
  target: '.myTarget || #myTarget',
  fontSizes: {
    medium: '1.5rem || 25px',
    large: '2.3rem || 40px'
  }
});
```

**[Font enlarger + Reader mode]**

```javascript
Logos.init({
  target: '.myTarget || #myTarget',
  imageRef: '.my__image',
  textContainer: '.my__textContainer',
  fontSizes: {
    medium: '1.5rem || 25px',
    large: '2.3rem || 40px'
  },
  readerMode: true
});
```

# Options

| Option        | Param           | Default |
| ------------- |:---------------:|:-------:|
| target        | string          | none    |
| imageRef      | string          | none    |
| textContainer | string          | none    |
| fontSizes     | object          | object  |
| readerMode    | bool            | false   |

# Description

```target``` Define the element where you want to inject each component.

**ATTENTION** Logos injects both modules **before the end** of the element.

---

```imageRef``` Define the image to look for in order to place it into the reader mode.

**ATTENTION** Logos looks for a ```src``` tag.

---

```textContainer``` Define the container that holds all the text of the article.

---

```fontSizes``` Define the size to apply on click of each font switch button.

---

```readerMode``` Enable the reader mode.
