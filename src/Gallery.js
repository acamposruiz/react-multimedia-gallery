import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';

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

    render(){
		const {
			cols,
			margin,
			items,
            onClickItem
		} = this.props;

		const containerWidth = this.state.containerWidth;

        const remainder = items.length % cols;

		// calculate the available space for the images by subtracting the margin space from the actual parent container width
		// the 2 is for each side of the image
		const containerSpace = Math.floor(containerWidth - (cols * (margin * 2))); 
		let itemNode = [];
		let lastRowWidth;
		let lastRowIndex;
		let photoIndex=0;
		let videoIndex=0;
		let articleIndex=0;

		function getItemIndex(type) {
		    switch (type) {
                case 'photo':
                    return photoIndex++;
                    break;
                case 'video':
                    return videoIndex++;
                    break;
                case 'article':
                    return articleIndex++;
                    break;
                default:
                    break;
            }
        }

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
				} = (items[j].type == 'photo' || items[j].type == 'video')? items[j]: { width: 100, height: 100};

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

                itemNode.push(this.renderItem(items[k], k, style, onClickItem, commonHeight, width, getItemIndex(items[k].type)));

            }
        }
		return(
	    	this.renderGallery(itemNode)
        );
    }
    renderItem(item, k, style, onClickItem, commonHeight, width, itemIndex) {

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
					<a href="#" className={k} onClick={(e) => onClickItem(itemIndex, e, 'photos')}>
						<img src={src} srcSet={srcset} sizes={sizes} style={{display:'block', border:0}} height={commonHeight} width={width} alt={alt} />
					</a>
				</div>
            );
        } else if (item.type == 'video') {

            const src = item.src;

            let srcset;
            let sizes;

            if (item.srcset){
                srcset = item.srcset.join();
            }
            if (item.sizes){
                sizes = item.sizes.join();
            }

            return(
                <div className="video-item-container" data-type="video" key={k} style={style}>
                    <a href="#" className={k} onClick={(e) => onClickItem(itemIndex, e, 'videos')}>
                        <img src={src} srcSet={srcset} sizes={sizes} style={{display:'block', border:0}} height={commonHeight} width={width} />
                        <i className="material-icons">play_circle_outline</i>
                    </a>
                </div>
            );
        }else if (item.type == 'article') {
            const content = item.content;
            return(
				<div className="text_thumbail" data-type="article" key={k} style={style}>
					<a href="#" className={k} onClick={(e) => onClickItem(itemIndex, e, 'articles')}>
							<span style={{display:'block', border:0, height:commonHeight, width:width}} className={css(this.textStyles(commonHeight,width).text_thumbail)}>{content}</span>
					</a>
				</div>
            );
        }
	}
    textStyles(commonHeight,width){
		return StyleSheet.create({

            // anchor
            text_thumbail: {
                padding: '21px',
                'box-sizing': 'border-box',
                cursor: 'pointer',
                height: commonHeight,
                'text-align': 'justify',
                'font-size': '20px',
                width: width,
                overflow: 'auto',
                'border-radius': '4px',

                '@media (min-width: 500px)': {
                },
            },
        });
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
    items: PropTypes.array.isRequired,
    onClickItem: PropTypes.func,
    cols: PropTypes.number,
    margin: PropTypes.number
};
Gallery.defaultProps = {
    cols: 3,
    onClickItem: (k,e) => {
		e.preventDefault();
    },
    margin: 2
}
// Gallery image style
const style = {
   display: 'block',
   float: 'left'
};

const classes = StyleSheet.create({

    // anchor
    text_thumbail: {
    },
});


export default Gallery;
