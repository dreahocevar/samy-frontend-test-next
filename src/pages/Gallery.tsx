// src/pages/Gallery.tsx
import React, { useCallback, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_IMAGES } from "../graphql/queries";
import { ImageCard } from "../components/ImageCard/ImageCard";
import styles from "../styles/Gallery.module.css";

interface ImageData {
  id: string;
  title: string;
  liked: boolean;
  likesCount: number;
  picture: string;
  price: number;
  author: string;
}

interface GalleryData {
  images: {
    edges: { node: ImageData }[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    __typename: string;
  };
}

interface GalleryVars {
  first: number;
  after: string | null;
}

const ITEMS_PER_PAGE = 9;

const Gallery: React.FC = () => {
  const { data, loading, error, fetchMore } = useQuery<
    GalleryData,
    GalleryVars
  >(GET_IMAGES, {
    variables: { first: ITEMS_PER_PAGE, after: null },
    notifyOnNetworkStatusChange: true,
  });

  // Extraemos las imágenes y la paginación si ya hay datos, o asignamos valores por defecto.
  const images: ImageData[] = data
    ? data.images.edges.map(({ node }) => node)
    : [];
  const hasNextPage: boolean = data ? data.images.pageInfo.hasNextPage : false;
  const endCursor: string | null = data ? data.images.pageInfo.endCursor : null;

  // Función para cargar más imágenes
  const loadMore = useCallback(() => {
    console.log("loadmorellamado"); // <-- Agrega este log

    fetchMore({
      variables: { first: ITEMS_PER_PAGE, after: endCursor },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prevResult;
        return {
          images: {
            __typename: prevResult.images.__typename,
            edges: [
              ...prevResult.images.edges,
              ...fetchMoreResult.images.edges,
            ],
            pageInfo: fetchMoreResult.images.pageInfo,
          },
        };
      },
    });
  }, [endCursor, fetchMore]);

  // Función que detecta el scroll cerca del final de la página
  const handleScroll = useCallback(() => {
    console.log("handleScroll llamado"); // <-- Agrega este log

    if (loading) return; // Evita llamadas mientras se está cargando
    if (!hasNextPage) return; // No hay más datos que cargar
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.offsetHeight;
    // Si el usuario está a 200px o menos del final, carga más imágenes.
    if (scrollTop + windowHeight >= docHeight - 200) {
      loadMore();
    }
  }, [loading, hasNextPage, loadMore]);

  // Agrega y remueve el listener del scroll
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className={styles.galleryContainer}>
      {/* Muestra un mensaje de carga inicial si no hay datos */}
      {loading && !data && <p>Loading...</p>}
      {error && <p>Oops, something went wrong</p>}
      {data && (
        <>
          <div className={styles.imageGrid}>
            {images.map((image) => (
              <ImageCard key={image.id} image={image} />
            ))}
          </div>
          {loading && <p>Cargando más imágenes...</p>}
        </>
      )}
    </div>
  );
};

export default Gallery;
