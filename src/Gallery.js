import React from 'react';
import PropTypes from 'prop-types';

class Gallery extends React.Component{
    constructor(){
		super();
		this.state = {
	    	containerWidth: 0
		};
		this.handleResize = this.handleResize.bind(this);
    }
    componentDidMount(){
		this.setState({containerWidth: Math.floor(this._gallery.clientWidth)})
        window.addEventListener('resize', this.handleResize);
    }
	componentDidUpdate(){
		if (this._gallery.clientWidth !== this.state.containerWidth){
	    	this.setState({containerWidth: Math.floor(this._gallery.clientWidth)});
		}
    }
    componentWillUnmount(){
		window.removeEventListener('resize', this.handleResize, false);
    }
    handleResize(e){
        this.setState({containerWidth: Math.floor(this._gallery.clientWidth)});
    }

    processItems(photos, articles) {

        function indexAll(elemts) {
            elemts.map((e,index) => e['oldIndex'] = index);
        }

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

        if (photos && articles) {
            indexAll(photos);
            indexAll(articles);
            return merge(photos, articles);
        } else if (photos) { return photos; } else { return articles; }
    }

    render(){
		const {
			cols,
			margin,
			photos,
            articles,
            onClickArticle,
			onClickPhoto
		} = this.props;



        const items = this.processItems(photos, articles);

		const containerWidth = this.state.containerWidth;

        const remainder = items.length % cols;

		// calculate the available space for the images by subtracting the margin space from the actual parent container width
		// the 2 is for each side of the image
		const containerSpace = Math.floor(containerWidth - (cols * (margin * 2))); 
		let itemNode = [];
		let lastRowWidth;
		let lastRowIndex;

        if (remainder) { // there are fewer photos than cols num in last row
          lastRowWidth = Math.floor( ((containerWidth / cols) * remainder) - (remainder * (margin * 2)) );
          lastRowIndex = items.length - remainder;
        }

        // loop thru each set of cols num
        // eg. if cols is 3 it will loop thru 0,1,2, then 3,4,5 to perform calculations for the particular set
        for (let i = 0; i < items.length; i+= cols){
            let totalAspectRatio = 0;
            let commonHeight = 0;

	    	// get the total aspect ratio of the row
            for (let j = i; j < i+cols; j++){

            	if (!items[j]) {
            		break;
				}

				const {
					width,
					height
				} = (items[j].type == 'photo')? items[j]: { width: 100, height: 100};

                if (j == items.length){
                    break;
                }
                items[j].aspectRatio = width / height;
				totalAspectRatio += items[j].aspectRatio;
            }
            if (i === lastRowIndex) {
              commonHeight = lastRowWidth / totalAspectRatio;
            } else {
              commonHeight = containerSpace / totalAspectRatio;
            }
            // run thru the same set of items again to give the width and common height
            for (let k=i; k<i+cols; k++){
                if (k == items.length){
                    break;
                }

                items[k] = items[k] || {};

				// explicity set the exact width of the image instead of letting the browser calculate it based on the height of the image
				// because the browser may round up or down and cause the image to break to the next row if its even 1 pixel off
				const width = commonHeight * items[k].aspectRatio;

				style.margin = margin;

                itemNode.push(this.renderItem(items[k], k, style, onClickPhoto, onClickArticle, commonHeight, width));

            }
        }
		return(
	    	this.renderGallery(itemNode)
        );
    }
    renderItem(item, k, style, onClickPhoto, onClickArticle, commonHeight, width) {
        const oldIndex = item.oldIndex;

        if (item.type == 'photo') {

            const src = item.src;
            const alt = item.alt;

            let srcset;
            let sizes;

            if (item.srcset){
                srcset = item.srcset.join();
            }
            if (item.sizes){
                sizes = item.sizes.join();
            }

            return(
				<div data-type="photo" key={k} style={style}>
					<a href="#" className={k} onClick={(e) => onClickPhoto(oldIndex, e)}>
						<img src={src} srcSet={srcset} sizes={sizes} style={{display:'block', border:0}} height={commonHeight} width={width} alt={alt} />
					</a>
				</div>
            );
        } else if (item.type == 'article') {
            const content = item.content;
            return(
				<div data-type="article" key={k} style={style}>
					<a href="#" className={k} onClick={(e) => onClickArticle(oldIndex, e)}>
						<div className="content"  style={{display:'block', border:0, height:commonHeight, width:width}}>
							<span>{content}</span>
						</div>
					</a>
				</div>
            );
        }
	}
    renderGallery(itemNodePreviewNodes){
		return(
	    	<div id="Gallery" className="clearfix" ref={(c) => this._gallery = c}>
				{itemNodePreviewNodes}
	    	</div>
		);
    }
};
Gallery.displayName = 'Gallery';
Gallery.propTypes = {
    photos: function(props, propName, componentName){
		return PropTypes.arrayOf(
	    	PropTypes.shape({
				src: PropTypes.string.isRequired,
				width: PropTypes.number.isRequired,
				height: PropTypes.number.isRequired,
				alt: PropTypes.string,
				srcset: PropTypes.array,
				sizes: PropTypes.array
	    })
	).isRequired.apply(this,arguments);
    },
    articles: PropTypes.array,
    onClickPhoto: PropTypes.func,
    cols: PropTypes.number,
    margin: PropTypes.number
};
Gallery.defaultProps = {
    cols: 3, 
    onClickPhoto: (k,e) => {
		e.preventDefault();
    },
    margin: 2
}
// Gallery image style
const style = {
   display: 'block',
   backgroundColor:'#e3e3e3',
   float: 'left'
}

export default Gallery;
