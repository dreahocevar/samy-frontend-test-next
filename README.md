# Samy Frontend SPA

A React app built with Next.js and Apollo Client for displaying images, with infinite scroll and like button functionality.

## Features

- [ ] Infinite Scroll: Loads more images as the user scrolls down.
- [ ] Like Button: Users can like an image, and the like count updates.
- [ ] Responsive Design: Works on desktop, tablet, and mobile.

## 🔌 API Overview

This project uses a **GraphQL** API to fetch images and handle the "like" functionality. It allows fetching images in a paginated way and supports mutations to like images.

### Key API Queries & Mutations:

1. **GET_IMAGES** Query:
   This query fetches a list of images along with their metadata (e.g., title, price, author, likes).

   ```graphql
   query GetImages($first: Int, $after: String) {
     images(first: $first, after: $after) {
       edges {
         node {
           id
           title
           picture
           price
           author
           likesCount
         }
       }
       pageInfo {
         hasNextPage
         endCursor
       }
     }
   }
   ```

2. LIKE_IMAGE Mutation:
   This mutation allows users to "like" an image, it returns the full ❤️heart❤️ with the new likesCount.

```
mutation LikeImage($input: LikeImageInput!) {
likeImage(input: $input) {
 success
 image {
   id
   liked
   likesCount
 }
}
}
```

The API is integrated using Apollo Client.

## 🛠️ Setup

1. Clone the repository

```
git clone https://github.com/yourusername/samy-frontend-test.git cd samy-frontend-test`
```

2. Install dependencies

```
npm install
```

3. Run the development server

```
npm run dev
```

🚀 Open your browser and go to http://localhost:3000. 🚀

### 🧪 Testing Setup

1. Install testing dependencies

```
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event @apollo/client @apollo/client/testing babel-jest
```

1. Run tests

```
npm test
```

Example Test

```

import { render, screen, fireEvent } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { ImageCard } from "./ImageCard";
import { LIKE_IMAGE } from "../../graphql/mutations";

const mockImage = {
  id: "1",
  title: "Test Image",
  liked: false,
  likesCount: 10,
  picture: "https://example.com/test.jpg",
  price: 100,
  author: "John Doe",
};

const mocks = [
  {
    request: {
      query: LIKE_IMAGE,
      variables: { input: { imageId: mockImage.id } },
    },
    result: {
      data: {
        likeImage: {
          success: true,
          image: { ...mockImage, liked: true, likesCount: 11 },
        },
      },
    },
  },
];

describe("ImageCard", () => {
  test("should like an image", async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ImageCard image={mockImage} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByAltText("Like"));

    expect(await screen.findByText("11")).toBeInTheDocument(); // Check if likes updated
  });
});

```

## 📦 Built With

- **Next.js** – React framework
- **Apollo Client** – For GraphQL data fetching
- **TypeScript** – For type safety and better development experience
- **Jest** – Testing framework
- **React Testing Library** – For testing React components

## 🚧 Roadmap and improvements

- [ ] Expand test coverage to include more edge cases and ensure robust error handling and state transitions.
- [ ] Refactor the image gallery to support more advanced **pagination techniques**.
- [ ] Improve accessibility by ensuring **keyboard navigation** and ensuring **descriptive alt text** for images.
- [ ] Responsive improvements
- [ ] Use the Web Share API (or similar) to link to social media platforms
- [ ] Show more information about the price when the user hovers or clicks on the tag using a tooltip or popover.
- [ ] Implement retry logic in case of failed network requests, to enhance reliability and user experience.
