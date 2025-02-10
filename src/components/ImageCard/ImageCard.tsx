// src/components/ImageCard/ImageCard.tsx
import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LIKE_IMAGE } from "../../graphql/mutations";
import Image from "next/image";
import styles from "./ImageCard.module.css";

export interface ImageData {
  id: string;
  title: string;
  liked: boolean;
  likesCount: number;
  picture: string;
  price: number;
  author: string;
}

interface ImageCardProps {
  image: ImageData;
}

export function ImageCard({ image }: ImageCardProps) {
  const [liked, setLiked] = useState(image.liked);
  const [likesCount, setLikesCount] = useState(image.likesCount);
  // Estado para activar la animación
  const [animate, setAnimate] = useState(false);

  const [likeImage] = useMutation(LIKE_IMAGE, {
    variables: { input: { imageId: image.id } },
  });

  const handleLike = async () => {
    try {
      await likeImage();
      if (liked) {
        setLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        setLiked(true);
        setLikesCount((prev) => prev + 1);
        setAnimate(true); // Activa la animación al dar like
      }
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  // Remover la animación después de un tiempo
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setAnimate(false);
      }, 300); // Duración de la animación (debe coincidir con la duración en CSS)
      return () => clearTimeout(timer);
    }
  }, [animate]);

  return (
    <div className={styles.imageCard}>
      <div className={styles.imageContainer}>
        <Image
          src={image.picture}
          alt={image.title}
          layout="fill"
          style={{ objectFit: "cover" }}
        />
        <div className={styles.priceWrapper}>
          <Image
            src="/corner.svg"
            alt="price background"
            fill
            style={{ objectFit: "contain" }}
            className={styles.cornerSvg}
          />
          <span className={styles.priceText}>{image.price} €</span>
        </div>
        <div className={styles.actions}>
          <div className={styles.actionsDiv} onClick={handleLike}>
            {/* Aplica la clase de animación condicionalmente */}
            <Image
              className={`${styles.actionsImg} ${
                animate ? styles.likeAnimation : ""
              }`}
              src={liked ? "/fullheart.svg" : "/heart.svg"}
              alt="Like"
              width={24}
              height={24}
            />
            <span>{likesCount}</span>
          </div>
          <div className={styles.actionsDiv}>
            <Image src="/share.svg" alt="Share" width={24} height={24} />
            <span>0</span>
          </div>
        </div>
      </div>
      <div className={styles.details}>
        <h3 className={styles.detailsH3}>{image.title}</h3>
        <p className={styles.detailsP}>
          by <span className={styles.detailsSpan}>{image.author}</span>
        </p>
      </div>
    </div>
  );
}
