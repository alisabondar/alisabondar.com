/**
 * The hero's "Currently obsessed with ___" line picks one of these at random on every page load.
 * `icon` matches a floating background icon (app/constants/icons.ts), which lights up while it's featured.
 */
export interface Hobby {
  label: string;
  icon?: string;
}

export const hobbies: Hobby[] = [
  { label: 'baking', icon: '/baking.png' },
  { label: 'cross-stitching', icon: '/cross-stitch.png' },
  { label: 'cycling', icon: '/road-bike.png' },
  { label: 'hiking', icon: '/hiking.png' },
  { label: 'skiing', icon: '/alpine.png' },
  { label: 'cooking', icon: '/cooking.png' },
  { label: 'gardening', icon: '/plant.png' },
  { label: 'a good book', icon: '/open-book.png' },
  { label: 'card games', icon: '/playing-cards.png' },
  { label: 'video games', icon: '/console.png' },
  { label: 'lifting', icon: '/dumbbell.png' },
  { label: 'planning the next trip', icon: '/airplane.png' },
  { label: 'yoga' },
];
