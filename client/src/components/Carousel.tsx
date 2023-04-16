import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

interface Images {
  images: any
}

const Carousel = ({images}: Images) => {
  return (
    <ImageGallery items={images} />
  )
}

export default Carousel