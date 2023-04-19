import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { EVENT_IMG_URL } from "../helpers/url";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Image {
  images: any[];
}

const Carousel = ({ images }: Image) => {
  const { id } = useParams();
  const [img, setImg] = useState<any[]>([])

  useEffect(() => {    

    const getImages = async () => {
      let photos: any[] = [];

      for (let element of images) {
        await new Promise(resolve => {
          photos.push({ original: `${EVENT_IMG_URL}${id}/${element}`, thumbnail: `${EVENT_IMG_URL}${id}/${element}`});
          resolve(null)
        })
      }
      
      setImg(photos)
    }
    
    getImages()

  }, []);

  return (<ImageGallery autoPlay items={img} />);
};

export default Carousel;


