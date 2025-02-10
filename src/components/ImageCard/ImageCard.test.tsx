import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { ImageCard, ImageData } from "./ImageCard";
import { LIKE_IMAGE } from "../../graphql/mutations";
import "@testing-library/jest-dom";

const testImage: ImageData = {
  id: "1",
  title: "Test Image",
  liked: false,
  likesCount: 10,
  picture: "https://loremflickr.com/300/300?random=0",
  price: 100,
  author: "Test Author",
};

const mocks: ReadonlyArray<MockedResponse> = [
  {
    request: {
      query: LIKE_IMAGE,
      variables: { input: { imageId: "1" } },
    },
    result: {
      data: {
        likeImage: {
          id: "1",
          liked: true,
          likesCount: 11,
          __typename: "Image",
        },
      },
    },
  },
];

describe("ImageCard Component", () => {
  it("should increment the likes count when the like button is clicked", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ImageCard image={testImage} />
      </MockedProvider>
    );

    expect(screen.getByText("10")).toBeInTheDocument();

    const likeButton = screen.getByAltText("Like");
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(screen.getByText("11")).toBeInTheDocument();
    });
  });
});
