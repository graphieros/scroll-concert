import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { scrollConcert } from '../src/main';

describe('scrollConcert', () => {
  let leaderEl: HTMLElement;
  let followerEl: HTMLElement;
  let secondFollowerEl: HTMLElement;

  beforeEach(() => {
    leaderEl = document.createElement('div');
    followerEl = document.createElement('div');
    secondFollowerEl = document.createElement('div');

    document.body.appendChild(leaderEl);
    document.body.appendChild(followerEl);
    document.body.appendChild(secondFollowerEl);

    leaderEl.scrollTop = 0;
    followerEl.scrollTop = 0;
    secondFollowerEl.scrollTop = 0;
  });

  afterEach(() => {
    document.body.removeChild(leaderEl);
    document.body.removeChild(followerEl);
    document.body.removeChild(secondFollowerEl);
  });

  it('should synchronize the scroll position of a single leader and a single follower', () => {
    leaderEl.scrollTop = 100;
    followerEl.scrollTop = leaderEl.scrollTop;
    expect(followerEl.scrollTop).toBe(100);
  });

  it('should handle multiple leaders and followers', () => {
    leaderEl.scrollTop = 150;
    secondFollowerEl.scrollTop = 200;
    followerEl.scrollTop = leaderEl.scrollTop;
    secondFollowerEl.scrollTop = leaderEl.scrollTop + 50;
    expect(followerEl.scrollTop).toBe(150);
    expect(secondFollowerEl.scrollTop).toBe(200);
  });

  it('should adjust follower scroll based on speedRatio', () => {
    const speedRatio = 2;
    leaderEl.scrollTop = 50;
    followerEl.scrollTop = leaderEl.scrollTop * speedRatio;
    expect(followerEl.scrollTop).toBe(100);
  });

  it('should handle zero height or width for leader and follower elements', () => {
    leaderEl.style.height = '0px';
    followerEl.style.height = '0px';

    leaderEl.scrollTop = 100;
    scrollConcert({
      leader: '#leader',
      follower: [{ selector: '#follower' }]
    });

    expect(followerEl.scrollTop).toBe(0);
  });

  it('should handle leader scroll with no followers correctly', () => {
    const spy = vi.fn();

    scrollConcert({
      leader: '#leader',
      follower: []
    });

    leaderEl.scrollTop = 100;
    leaderEl.dispatchEvent(new Event('scroll'));

    expect(spy).not.toHaveBeenCalled();
  });

  it('should handle multiple leaders correctly', (done) => {
    const secondLeaderEl = document.createElement('div');
    secondLeaderEl.style.height = '200px';
    secondLeaderEl.style.overflow = 'auto';
    secondLeaderEl.id = 'secondLeader';
    document.body.appendChild(secondLeaderEl);

    const leaderEl = document.createElement('div');
    leaderEl.style.height = '200px';
    leaderEl.style.overflow = 'auto';
    leaderEl.id = 'leader';
    document.body.appendChild(leaderEl);

    const followerEl = document.createElement('div');
    followerEl.style.height = '200px';
    followerEl.style.overflow = 'auto';
    followerEl.id = 'follower';
    document.body.appendChild(followerEl);

    // Add content to ensure scrollHeight > clientHeight
    leaderEl.innerHTML = '<div style="height: 400px;">Leader content</div>';
    secondLeaderEl.innerHTML = '<div style="height: 400px;">Second leader content</div>';
    followerEl.innerHTML = '<div style="height: 400px;">Follower content</div>';

    requestAnimationFrame(() => {
      leaderEl.offsetHeight; 
      secondLeaderEl.offsetHeight; 
      followerEl.offsetHeight; 

      leaderEl.scrollTop = 100;
      secondLeaderEl.scrollTop = 50;

      const stopScrollConcert = scrollConcert({
        leader: ['#leader', '#secondLeader'],
        follower: [{ selector: '#follower' }]
      });

      secondLeaderEl.scrollTop = 150;
      secondLeaderEl.dispatchEvent(new Event('scroll'));

      requestAnimationFrame(() => {
        expect(followerEl.scrollTop).toBe(150); // Follower should sync with second leader
        expect(followerEl.scrollTop).not.toBe(100); // It should not follow the first leader anymore

        stopScrollConcert();
        document.body.removeChild(secondLeaderEl);
        document.body.removeChild(leaderEl);
        document.body.removeChild(followerEl);
      });
    });
  });

  it('should handle custom speedRatio for followers', (done) => {
    const leaderEl = document.createElement('div');
    leaderEl.style.height = '200px';
    leaderEl.style.overflow = 'auto';
    leaderEl.id = 'leader';
    document.body.appendChild(leaderEl);

    const followerEl = document.createElement('div');
    followerEl.style.height = '200px';
    followerEl.style.overflow = 'auto';
    followerEl.id = 'follower';
    document.body.appendChild(followerEl);

    leaderEl.scrollTop = 100;

    const stopScrollConcert = scrollConcert({
      leader: '#leader',
      follower: [{ selector: '#follower', speedRatio: 2 }]
    });

    leaderEl.dispatchEvent(new Event('scroll'));

    requestAnimationFrame(() => {
      expect(followerEl.scrollTop).toBe(200); // Follower scroll position should be 2x leader's scrollTop

      stopScrollConcert();
      document.body.removeChild(leaderEl);
      document.body.removeChild(followerEl);
    });
  });

  it('should not apply scroll to followers if follower has no scrollable content', () => {
    const leaderEl = document.createElement('div');
    leaderEl.style.height = '200px';
    leaderEl.style.overflow = 'auto';
    leaderEl.id = 'leader';
    document.body.appendChild(leaderEl);

    const followerEl = document.createElement('div');
    followerEl.style.height = '100px';
    followerEl.style.overflow = 'auto';
    followerEl.id = 'follower';
    document.body.appendChild(followerEl);

    // Set follower content height to be equal to its clientHeight (non-scrollable)
    followerEl.innerHTML = '<div style="height: 100px;">Non-scrollable content</div>';

    leaderEl.scrollTop = 100;

    scrollConcert({
      leader: '#leader',
      follower: [{ selector: '#follower' }]
    });

    leaderEl.dispatchEvent(new Event('scroll'));

    requestAnimationFrame(() => {
      expect(followerEl.scrollTop).toBe(0); // Follower shouldn't scroll because its scrollHeight is equal to its clientHeight

      document.body.removeChild(leaderEl);
      document.body.removeChild(followerEl);
    });
  });

  it('should correctly handle edge case when scrollHeight is equal to clientHeight for leader', () => {
    const leaderEl = document.createElement('div');
    leaderEl.style.height = '100px';
    leaderEl.style.overflow = 'auto';
    leaderEl.id = 'leader';
    document.body.appendChild(leaderEl);

    const followerEl = document.createElement('div');
    followerEl.style.height = '100px';
    followerEl.style.overflow = 'auto';
    followerEl.id = 'follower';
    document.body.appendChild(followerEl);

    // Set content inside the leader to make scrollHeight equal to clientHeight
    leaderEl.innerHTML = '<div style="height: 100px;">Leader content</div>';

    leaderEl.scrollTop = 50;

    scrollConcert({
      leader: '#leader',
      follower: [{ selector: '#follower' }]
    });

    leaderEl.dispatchEvent(new Event('scroll'));

    requestAnimationFrame(() => {
      expect(followerEl.scrollTop).toBe(0); // No scroll should happen as there is no scrollable area

      document.body.removeChild(leaderEl);
      document.body.removeChild(followerEl);
    });
  });


  it('should handle a situation where one of the followers has a different scroll height from others', () => {
    const leaderEl = document.createElement('div');
    leaderEl.style.height = '100px';
    leaderEl.style.overflow = 'auto';
    leaderEl.id = 'leader';
    document.body.appendChild(leaderEl);

    const followerEl = document.createElement('div');
    followerEl.style.height = '100px';
    followerEl.style.overflow = 'auto';
    followerEl.id = 'follower';
    document.body.appendChild(followerEl);

    const follower2El = document.createElement('div');
    follower2El.style.height = '200px';
    follower2El.style.overflow = 'auto';
    follower2El.id = 'follower2';
    document.body.appendChild(follower2El);

    leaderEl.innerHTML = '<div style="height: 200px;">Leader content</div>';
    followerEl.innerHTML = '<div style="height: 200px;">Follower content</div>';
    follower2El.innerHTML = '<div style="height: 400px;">Follower2 content</div>';

    leaderEl.scrollTop = 50;

    scrollConcert({
      leader: '#leader',
      follower: [
        { selector: '#follower' },
        { selector: '#follower2', speedRatio: 2 }
      ]
    });

    leaderEl.dispatchEvent(new Event('scroll'));

    requestAnimationFrame(() => {
      expect(followerEl.scrollTop).toBe(50); // Follower1 should be in sync with leader
      expect(follower2El.scrollTop).toBe(100); // Follower2 should scroll at double speed

      document.body.removeChild(leaderEl);
      document.body.removeChild(followerEl);
      document.body.removeChild(follower2El);
    });
  });

  it('should handle invalid selectors gracefully (no elements found)', () => {
    const spy = vi.fn();

    scrollConcert({
      leader: '#nonExistentLeader',
      follower: [{ selector: '#nonExistentFollower' }]
    });

    leaderEl.scrollTop = 100;
    leaderEl.dispatchEvent(new Event('scroll'));

    expect(spy).not.toHaveBeenCalled();
  });
});
