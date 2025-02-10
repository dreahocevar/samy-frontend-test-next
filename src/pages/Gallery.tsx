import React, { useCallback, useEffect, useState } from "react";
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

  const [loadingMore, setLoadingMore] = useState(false);

  const images: ImageData[] = data
    ? data.images.edges.map(({ node }) => node)
    : [];
  const hasNextPage: boolean = data ? data.images.pageInfo.hasNextPage : false;
  const endCursor: string | null = data ? data.images.pageInfo.endCursor : null;

  console.log("hasNextPage:", hasNextPage);
  console.log("endCursor:", endCursor);

  const loadMore = useCallback(() => {
    console.log("loadMore called");

    if (loadingMore || !hasNextPage) {
      console.log("No more images to load or already loading");
      return;
    }
    setLoadingMore(true);

    console.log("Fetching more images...");
    console.log("End Cursor: ", endCursor);

    fetchMore({
      variables: { first: ITEMS_PER_PAGE, after: endCursor },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        setLoadingMore(false);
        if (!fetchMoreResult) {
          console.log("No more images returned by fetchMore");
          return prevResult;
        }

        console.log("Fetched more images");
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
  }, [endCursor, hasNextPage, fetchMore, loadingMore]);

  const handleScroll = useCallback(() => {
    console.log("handleScroll called");

    if (loadingMore || loading) {
      console.log("Still loading or already fetching images");
      return;
    }
    if (!hasNextPage) {
      console.log("No more images to load");
      return;
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.offsetHeight;

    console.log("Scroll position: ", scrollTop);
    console.log("Window height: ", windowHeight);
    console.log("Document height: ", docHeight);

    if (scrollTop + windowHeight >= docHeight - 200) {
      console.log("Triggering loadMore due to scroll near bottom");
      loadMore();
    }
  }, [loadingMore, loading, hasNextPage, loadMore]);

  useEffect(() => {
    console.log("Adding scroll event listener");
    window.addEventListener("scroll", handleScroll);
    return () => {
      console.log("Removing scroll event listener");
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className={styles.galleryContainer}>
      {loading && !data && <p>Loading...</p>}
      {error && <p>Oops, something went wrong</p>}
      {data && (
        <>
          <div className={styles.imageGrid}>
            {images.map((image) => (
              <ImageCard key={image.id} image={image} />
            ))}
          </div>
          {loadingMore && <p>Loading more images...</p>}
        </>
      )}
    </div>
  );
};

export default Gallery;
