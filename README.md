# React Responsive Multimedia Gallery

[![Join the chat at https://gitter.im/react-multimedia-gallery/Lobby](https://badges.gitter.im/react-multimedia-gallery/Lobby.svg)](https://gitter.im/react-multimedia-gallery/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A stateless responsive React multimedia gallery component to manage photos, texts and videos (only from youtube), that maintains the original aspect ratio of your photos and scales them responsively.
Add your own routing, lightbox, and manage your own state. 

## Installation

To install:

```
npm install --save react-multimedia-gallery
```

### Video thumbnail

The images included in the video object are the thumbnail to show in the gallery before play de video.

## Demo

[http://acamposruiz.github.io/react-multimedia-gallery/](http://acamposruiz.github.io/react-multimedia-gallery/)

To build the examples locally, run:

```
npm install
npm start
```

Then open [`localhost:8000`](http://localhost:8000) in a browser.

## Use

```jsx
import React from 'react';
import Gallery from 'react-multimedia-gallery';

export default class Sample extends React.Component {
    render() {
	return (
	    <Gallery items={ITEMS_SET} onClickItem={this.openLightbox} />
	);
    }
}
const ARTICLE_SET = [
   {
     type:'article',
     content:'Text1...',
   },
   {
     type:'article',
     content:'Text2...',
   },
   {
     type:'article',
     content:'Text3...',
   },
]
const PHOTO_SET = [
  {
    src: 'http://example.com/example/img1.jpg',
    srcset: [
      'http://example.com/example/img1_1024.jpg 1024w',
      'http://example.com/example/img1_800.jpg 800w',
      'http://example.com/example/img1_500.jpg 500w',
      'http://example.com/example/img1_320.jpg 320w',
    ],
    sizes:[
      '(min-width: 480px) 50vw',
      '(min-width: 1024px) 33.3vw',
      '100vw'
    ],
    width: 681,
    height: 1024,
    alt: 'image 1',
    type: 'photo',
  },
  {
    src: 'http://example.com/example/img2.jpg',
    srcset: [
      'http://example.com/example/img2_1024.jpg 1024w',
      'http://example.com/example/img2_800.jpg 800w',
      'http://example.com/example/img2_500.jpg 500w',
      'http://example.com/example/img2_320.jpg 320w',
    ],
    sizes:[
      '(min-width: 480px) 50vw',
      '(min-width: 1024px) 33.3vw',
      '100vw'
    ],
    width: 600,
    height: 600,
    alt: 'image 2',
  }
];
const VIDEO_SET = [
  {
    src: 'https://img.youtube.com/vi/<insert-youtube-video-id-here>/0.jpg',
    srcset: [
      'https://i1.ytimg.com/vi/<insert-youtube-video-id-here>/maxresdefault.jpg 1024w',
      'https://i1.ytimg.com/vi/<insert-youtube-video-id-here>/sddefault.jpg 800w',
      'https://i1.ytimg.com/vi/<insert-youtube-video-id-here>/hqdefault.jpg 500w',
      'https://i1.ytimg.com/vi/<insert-youtube-video-id-here>/mqdefault.jpg 320w',
    ],
    sizes:[
      '(min-width: 480px) 50vw',
      '(min-width: 1024px) 33.3vw',
      '100vw'
    ],
    width: 681,
    height: 1024,
    content: 'youtubeId1',
    type: 'video',
  },
  {
    src: 'https://img.youtube.com/vi/<insert-youtube-video-id-here>/0.jpg',
    srcset: [
      'https://i1.ytimg.com/vi/<insert-youtube-video-id-here>/maxresdefault.jpg 1024w',
      'https://i1.ytimg.com/vi/<insert-youtube-video-id-here>/sddefault.jpg 800w',
      'https://i1.ytimg.com/vi/<insert-youtube-video-id-here>/hqdefault.jpg 500w',
      'https://i1.ytimg.com/vi/<insert-youtube-video-id-here>/mqdefault.jpg 320w',
    ],
    sizes:[
      '(min-width: 480px) 50vw',
      '(min-width: 1024px) 33.3vw',
      '100vw'
    ],
    width: 681,
    height: 1024,
    content: 'youtubeId2',
    type: 'video',
  }
];

const ITEMS_SET = PHOTO_SET.concat(VIDEO_SET.concat(ARTICLE_SET));

```

### Gallery properties

Property        |       Type            |       Default         |       Description
:-----------------------|:--------------|:--------------|:--------------------------------
items | array  | undefined  | required; array of objects that can be photos, videos on youtube or articles
cols | number  | 3  | optional; number of photos per row
onClickItem | function  | function  | optional; do something when the user clicks a item
margin | number  | 2  | optional; number of margin pixels around each entire image

### Photo object in Gallery.items properties

Property        |       Type            |       Default         |       Description
:-----------------------|:--------------|:--------------|:--------------------------------
src     |       string    |       undefined    |       required; the img src attribute value of the gallery image
srcset     |       string    |       undefined    |       optional; the img srcset attribute value of the gallery image
sizes     |       string    |       undefined    |       optional; the img sizes attribute value of the gallery image
width | number  | undefined  | required; original width of the gallery image (only used for calculating aspect ratio)
height  | number  | undefined | required; original height of the gallery image (only used for calculating aspect ratio)
alt  | string  | undefined | optional; alt text of the gallery image
type  | string  | undefined | required set to photo value

### Video object in Gallery.items properties

Property        |       Type            |       Default         |       Description
:-----------------------|:--------------|:--------------|:--------------------------------
src     |       string    |       undefined    |       required; the img src attribute value of the gallery image
srcset     |       string    |       undefined    |       optional; the img srcset attribute value of the gallery image
sizes     |       string    |       undefined    |       optional; the img sizes attribute value of the gallery image
width | number  | undefined  | required; original width of the gallery image (only used for calculating aspect ratio)
height  | number  | undefined | required; original height of the gallery image (only used for calculating aspect ratio)
type  | string  | undefined | required set to video value
content  | string  | undefined | required; id of the video on youtube

### Article object in Gallery.items properties

Property        |       Type            |       Default         |       Description
:-----------------------|:--------------|:--------------|:--------------------------------
content     |       string    |       undefined    |       required; text content
type  | string  | undefined | required set to article value


## User Guide / Best Practice

### Dynamic column count

The number of columns and when they change is something the user has control over in their app. The parameter `cols` allows the adjustment of the displayed colums. In combination with `react-measure` this allows the demo page to adjust colums (https://github.com/acamposruiz/react-multimedia-gallery/blob/master/examples/src/app.js#L103). Code snippet:

```
import { Measure } from 'react-measure';
function ResponsiveGallery (props) {
  const { maxImageWidth = 300 } = props;
  return (
    <Measure whitelist={['width']}>
      {({ width }) => (
        <Gallery cols={Math.ceil(width / maxImageWidth)}>....</Gallery>
      )}
    </Measure>
  );
}
```
This idea was discussed in #32 and proposed by @smeijer.

### Passing in photos

In the demo I chose to have one object of photos that I pass in to both the Gallery component and the Lightbox component to keep the code cleaner and stateless.  Stateless because I can keep the Lightbox outside of the Gallery component and the user can decide whether to use any Lightbox of their choosing or none at all. I added all the properties into this object that either component might need or that I wanted to use for customization.


## Other notes
This component uses [React Images, Texts and Videos](https://github.com/acamposruiz/react-images-texts-videos) for lightbox functionality in the example demo, but the component itself does not depend on it.

To gain a good understanding of 'srcset' and 'sizes' attributes, I found this site very helpful: [https://ericportis.com/posts/2014/srcset-sizes/](https://ericportis.com/posts/2014/srcset-sizes/).

