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
        this.state = {items:{
            type: 'images',
            items: []
        }, articles:null, photos:null, pageNum:1, totalPages:1, loadedAll: false, currentItem:0};
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
    loadMoreContent(){
        Promise.all([this.loadMorePhotos, this.loadMoreArticles]).then(data => {
            this.setState({
                photos: this.state.photos ? this.state.photos.concat(data[0].photos) : data[0].photos,
                articles: this.state.articles ? this.state.articles.concat(data[1].articles) : data[0].articles,
                pageNum: data[0].pageNum,
                totalPages: data[0].totalPages
            });
        })
    }
    loadMoreArticles(){
        return new Promise((resolve, reject) => {
            resolve({'articles': Array(3).fill(loremIpsum({count: 3, units: 'sentences'}))});
        });
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
	    	this.setState({
				photos: this.state.photos ? this.state.photos.concat(photos) : photos,
				articles: this.state.articles ? this.state.articles.concat(articles) : articles,
				pageNum: this.state.pageNum + 1,
				totalPages: data.photoset.pages
	    	});
          }.bind(this),
          error: (xhr, status, err) => {
            console.error(status, err.toString());
          }.bind(this)
        });
    }
    openLightbox(typeItem){

        return function(index, event) {
            event.preventDefault();
            this.setState({
                items: {
                    type: (typeItem == 'photos')? 'images':(typeItem == 'articles')? 'texts':'videos',
                    items: (typeItem == 'photos')? this.state[typeItem]:this.state[typeItem].map(item => item.content)
                },
                currentItem: index,
                lightboxIsOpen: true
            });
        }.bind(this);

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
		    		return <Gallery articles={this.state.articles}  photos={this.state.photos} cols={cols} onClickPhoto={this.openLightbox('photos')}  onClickArticle={this.openLightbox('articles')} />
				}
	    	}
	    	</Measure>
		);
    }
    render(){
        if (this.state.photos){
            return(
				<div className="App">
		    		{this.renderGallery()}
		    		<Lightbox
						theme={{container: { background: 'rgba(0, 0, 0, 0.85)' }}}
						items={this.state.items}
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
