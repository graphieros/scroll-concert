# Scroll Concert 🎶

## A Simple Library for Synchronizing Scroll Events Across Multiple Elements

Scroll Concert is a lightweight JavaScript library designed to effortlessly sync scroll positions across multiple elements on your page. If you need synchronized scrolling behavior, Scroll Concert makes it easy to keep your scrollable elements in harmony. It is ideal to create parallax effects.

### Features

- **Multiple Leaders**: Sync multiple leader elements with one or more followers.
- **Custom Speed Control**: Control how fast followers scroll in relation to the leader using a customizable speed ratio.
- **No Scroll for Non-Scrollable Elements**: Automatically detects elements that can't scroll and won't try to sync them.
- **Edge Case Handling**: Handles edge cases like scroll height and client height discrepancies gracefully.
- **Lightweight & No Dependencies**: Small and efficient — zero dependencies.

### Installation

```bash
npm i scroll-concert
```

or

```bash
yarn add scroll-concert
```

### Usage

After installation, simply include the library in your project and call `scrollConcert` to sync scroll positions between your elements.

#### Basic Example

```js
import scrollConcert from "scroll-concert";

// Sync one leader with a follower
scrollConcert({
  leader: "#leader", // The selector for your leader element(s)
  follower: [{ selector: "#follower" }], // The selector for your follower(s)
});
```

#### Multiple Leaders

```js
scrollConcert({
  leader: ["#leader", "#secondLeader"], // Multiple leaders
  follower: [{ selector: "#follower" }], // One follower
});
```

#### Custom Speed Ratio

Control the speed of your followers with a `speedRatio`. For example, if you want your follower to scroll twice as fast as the leader:

```js
scrollConcert({
  leader: "#leader",
  follower: [
    { selector: "#followerA", speedRatio: 2 }, // Follower scrolls twice as fast
    { selector: "#followerB", speedRatio: 3 }, // Follower scrolls thrice as fast
  ],
});
```

#### Stopping the Sync

scrollConcert returns a function you can call to top synchronization:

```js
const stopTheMusic = scrollConcert({
  leader: "#leader",
  follower: [{ selector: "#follower" }],
});

// Later, when you want to stop the synchronization:
stopTheMusic();
```

### Edge Case Handling

Scroll Concert automatically handles edge cases like when an element is not scrollable or when `scrollHeight` is equal to `clientHeight`. No unnecessary scrolling will occur, ensuring a smooth user experience.

### API

```ts
export type Leader = string | string[];
export type Follower = {
  selector: string;
  speedRatio?: number;
};

export type ConcertParams = {
  leader: Leader; // The leader element(s) (id, class, or selector)
  follower: Follower | Follower[]; // The follower element(s)
};

function scrollConcert(params: ConcertParams): () => void; // Returns a stop function
```

### Why Use Scroll Concert?

- **Simplicity**: With just a few lines of code, you can synchronize scrolling between multiple elements.
- **Performance**: Optimized for performance with minimal impact on page load time.

### Testing

To run the tests locally:

1. Clone the repository.
2. Install the dependencies:
   ```bash
   npm i
   ```
3. Run the tests:
   ```bash
   npm run test
   ```
   You can also test manually with the index.html provided in the project, which has a simple parallax implementation.

Scroll Concert uses [Vitest](https://vitest.dev/) for unit tests, to ensure the library works in various scenarios.

### Contributing

We welcome contributions to make this library even better! Feel free to fork the repository, make changes, and submit pull requests.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
