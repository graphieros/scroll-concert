import { ConcertParams } from "./scroll-concert";

/**
 * Scrolls a set of elements in tandem, where one element (the leader) controls the scrolling behavior 
 * and other elements (followers) follow the lead by adjusting their scroll positions. This is useful 
 * for creating synchronized or mirrored scrolling effects between multiple DOM elements.
 * 
 * @param {ConcertParams} params - An object containing two properties: `leader` and `follower`.
 * @param {string | Array<string>} params.leader - A single selector string or an array of selector strings representing the leader element(s). These selectors will be used to query DOM elements that need to be scrolled.
 * @param {Array<{selector: string, speedRatio?: number}>} params.follower - An array of objects where each object contains a `selector` property (representing the follower selector) and an optional `speedRatio` property which determines how much the follower should adjust its scroll position relative to the leader's scroll position.
 * 
 * @returns {Function} A function that, when called, stops the automatic scrolling event listener from being triggered on any of the leader elements.
 */
export function scrollConcert({
    leader,
    follower,
}: ConcertParams): Function {
    const leaderElements = Array.isArray(leader) ? leader : [leader];
    const followerElements = Array.isArray(follower) ? follower : [follower];

    // Cache the elements to avoid querying the DOM multiple times
    const leaderEls: Array<HTMLElement | null> = leaderElements.map(selector => document.querySelector(selector));
    const followerEls: Array<HTMLElement | null> = followerElements.map(({ selector }) => document.querySelector(selector));

    let isScrolling = false;

    function handleScroll(leaderEl: HTMLElement) {
        if (isScrolling) return; // Prevent multiple executions
        isScrolling = true;

        const scrollHeight = leaderEl.scrollHeight;
        const clientHeight = leaderEl.clientHeight;
        const scrollWidth = leaderEl.scrollWidth;
        const clientWidth = leaderEl.clientWidth;

        if (scrollHeight <= clientHeight || clientHeight === 0) {
            console.error('Invalid leader scrollHeight or clientHeight', { scrollHeight, clientHeight });
            isScrolling = false;
            return;
        }

        const verticalScrollPosition = leaderEl.scrollTop / (scrollHeight - clientHeight);
        const horizontalScrollPosition = leaderEl.scrollLeft / (scrollWidth - clientWidth);

        followerEls.forEach((followerEl, i) => {
            if (followerEl) {
                const followerHeight = followerEl.scrollHeight;
                const followerClientHeight = followerEl.clientHeight;
                const followerWidth = followerEl.scrollWidth;
                const followerClientWidth = followerEl.clientWidth;

                if (followerHeight <= followerClientHeight || followerClientHeight === 0) {
                    console.error('Invalid follower scrollHeight or clientHeight', { followerHeight, followerClientHeight });
                    return;
                }

                const speedRatio = followerElements[i].speedRatio ?? 1;
                const calculatedVerticalScroll = verticalScrollPosition * (followerHeight - followerClientHeight) * speedRatio;
                const calculatedHorizontalScroll = horizontalScrollPosition * (followerWidth - followerClientWidth) * speedRatio;

                followerEl.scrollTop = calculatedVerticalScroll;
                followerEl.scrollLeft = calculatedHorizontalScroll;
            }
        });

        isScrolling = false;
    }

    leaderEls.forEach(leaderEl => {
        if (leaderEl) {
            leaderEl.addEventListener('scroll', () => handleScroll(leaderEl));
        }
    });

    return () => {
        leaderEls.forEach(leaderEl => {
            if (leaderEl) {
                leaderEl.removeEventListener('scroll', () => handleScroll(leaderEl));
            }
        });
    };
}
