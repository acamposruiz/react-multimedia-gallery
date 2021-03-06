import React from 'react';
import ReactDOM from 'react-dom';
import Gallery from 'react-multimedia-gallery';
import $ from 'jquery';
import _ from 'lodash';
import Measure from 'react-measure';
import Lightbox from 'react-images-texts-videos';
import loremIpsum from 'lorem-ipsum';

class App extends React.Component{
    constructor(){
		super();
        this.state = {page:0, items:null, photos:null, articles:null,   videos:null,  itemsLightbox:{
            type: 'images',
            items: []
        }, pageNum:1, totalPages:1, loadedAll: false, currentItem:0};
		this.handleScroll = this.handleScroll.bind(this);
		this.loadMorePhotos = this.loadMorePhotos.bind(this);
		this.closeLightbox = this.closeLightbox.bind(this);
		this.closeLightbox = this.closeLightbox.bind(this);
		this.openLightbox = this.openLightbox.bind(this);
		this.gotoNext = this.gotoNext.bind(this);
		this.gotoPrevious = this.gotoPrevious.bind(this);
    }
    componentDidMount() {
        this.loadMorePhotos();
        this.loadMorePhotos = _.debounce(this.loadMorePhotos, 200);
        window.addEventListener('scroll', this.handleScroll);
    }
    handleScroll(){
		let scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
		if ((window.innerHeight + scrollY) >= (document.body.offsetHeight - 50)) {
	    	this.loadMorePhotos();
		}
    }
    loadMorePhotos(e){
        if (e){
            e.preventDefault();
        }
		if (this.state.pageNum > this.state.totalPages){
	    	this.setState({loadedAll: true});
	    	return;
		}

        $.ajax({
          url: 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=372ef3a005d9b9df062b8240c326254d&photoset_id=72157680705961676&user_id=57933175@N08&format=json&per_page=21&page='+this.state.pageNum+'&extras=url_m,url_c,url_l,url_h,url_o',
          dataType: 'jsonp',
          jsonpCallback: 'jsonFlickrApi',
          cache: false,
          success: (data) => {
              console.log(data);
	    	let photos = data.photoset.photo.map((item) => {
                let aspectRatio = parseFloat(item.width_o / item.height_o);
				return {
                    src: (aspectRatio >= 3) ? item.url_c : item.url_m,
                    width: parseInt(item.width_o),
                    height: parseInt(item.height_o),
                    caption: item.title,
                    alt: item.title,
                    type: 'photo',
                    srcset:[
						item.url_m+' '+item.width_m+'w',
                        item.url_c+' '+item.width_c+'w',
                        item.url_l+' '+item.width_l+'w',
                        item.url_h+' '+item.width_h+'w'
                    ],
		    		sizes:[
						'(min-width: 480px) 50vw',
						'(min-width: 1024px) 33.3vw',
						'100vw'
		    		]
				};
	    	});
	    	const articles = Array(1,1,1).map(item => {
	    	    return {type:'article', content:loremIpsum({count: 10, units: 'sentences'})};
            });
	    	const videos = Array(
	    	    Array('jlNvOWDfMYo', 'iRXJXaLV0n4', 'geqVuYmo8Y0', 'tntOCGkgt98'),
                Array('1demxrg1pXE','DK9JIaokhc0','IrdYueB9pY4', 'sgiR7blUDA8'),
                Array('Mq0yEI_xpb8','Ec7gzVZv0','shluYa5WDUQ', 'hY7m5jjJ9mM'),
                Array('4a0FbQdH3dY','cfnXs03FA5s','IX7pdpm1gp8', 'QFH747sK200'))[this.state.page].map((youtubeId) => {
                return {
                    src: `https://i1.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`,
                    width: 1920,
                    height: 1080,
                    type: 'video',
                    content: youtubeId,
                    srcset:[
                        `https://i1.ytimg.com/vi/${youtubeId}/maxresdefault.jpg 1024w`,
                        `https://i1.ytimg.com/vi/${youtubeId}/sddefault.jpg 800w`,
                        `https://i1.ytimg.com/vi/${youtubeId}/G0wGs3useV8.jpg 500w`,
                        `https://i1.ytimg.com/vi/${youtubeId}/G0wGs3useV8.jpg 320w`,
                    ],
                    sizes:[
                        '(min-width: 480px) 50vw',
                        '(min-width: 1024px) 33.3vw',
                        '100vw'
                    ]
                };
            });
            this.setState({page: this.state.page + 1});
	    	let items = processItems(photos, articles,  videos);
	    	this.setState({
                photos: this.state.photos ? this.state.photos.concat(photos) : photos,
                articles: this.state.articles ? this.state.articles.concat(articles) : articles,
                videos: this.state.videos ? this.state.videos.concat(videos) : videos,
				items: this.state.items ? this.state.items.concat(items) : items,
				pageNum: this.state.pageNum + 1,
				totalPages: data.photoset.pages
	    	});
          }.bind(this),
          error: (xhr, status, err) => {
            console.error(status, err.toString());
          }.bind(this)
        });

        function processItems(photos, articles,  videos) {

            function merge(array1,array2) {

                let output = [];

                const [arrayBase,arrayIntro] = (array1.length > array2.length)? [array1,array2]: [array2,array1];

                const size = Math.floor(arrayBase.length / arrayIntro.length);


                for (var i=0,j=0; i<arrayBase.length; i+=size, j++) {

                    if (j >= arrayIntro.length) {
                        output = output.concat(arrayBase.slice(i));
                        break;
                    } else {
                        output.push(arrayIntro[j]);
                        output = output.concat(arrayBase.slice(i,i+size));
                    }

                }

                return output;

            }

            if (photos && articles && videos) {
                return merge(merge(videos, articles), photos);
            } else if (photos) { return photos; } else { return articles; }
        }
    }
    openLightbox(index, event, typeItem){
        event.preventDefault();

        this.setState({
            itemsLightbox: {
                type: (typeItem == 'photos')? 'images':(typeItem == 'articles')? 'texts':'videos',
                items: (typeItem == 'photos')? this.state[typeItem]:this.state[typeItem].map(item => item.content)
            },
            currentItem: index,
            lightboxIsOpen: true
        });

    }
    closeLightbox(){
        this.setState({
            currentItem: 0,
            lightboxIsOpen: false,
        });
    }
    gotoPrevious(){
        this.setState({
            currentItem: this.state.currentItem - 1,
        });
    }
    gotoNext(){
        if(this.state.photos.length - 2 === this.state.currentItem){
            this.loadMorePhotos();
        }
        this.setState({
            currentItem: this.state.currentItem + 1,
        });
    }
    renderGallery(){
		return(
	    	<Measure whitelist={['width']}>
	    	{
				({ width }) => {
		    		let cols = 1;
		    		if (width >= 480){
						cols = 2;
		    		}
		    		if (width >= 1024){
						cols = 3;
		    		}
		    		return <Gallery items={this.state.items}  cols={cols} onClickItem={this.openLightbox} />
				}
	    	}
	    	</Measure>
		);
    }
    render(){
        if (this.state.items){
            return(
				<div className="App">
		    		{this.renderGallery()}
		    		<Lightbox
						theme={{container: { background: 'rgba(0, 0, 0, 0.85)' }}}
						items={this.state.itemsLightbox}
						backdropClosesModal={true}
						onClose={this.closeLightbox}
						onClickPrev={this.gotoPrevious}
						onClickNext={this.gotoNext}
						currentItem={this.state.currentItem}
						isOpen={this.state.lightboxIsOpen}
						width={1600}
					/>
		    		{!this.state.loadedAll && <div className="loading-msg" id="msg-loading-more">Loading</div>}
				</div>
            );
        }
        else{
            return(
				<div className="App">
					<div id="msg-app-loading" className="loading-msg">Loading</div>
				</div>
            );
        }
    }
};

ReactDOM.render(<App />, document.getElementById('app'));
