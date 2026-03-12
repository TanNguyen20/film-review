export interface Movie {
  id: number
  title: string
  genre: string
  genreList: string[]
  rating: number
  year: number
  poster: string
  rank: number
  hot: boolean
  director: string
  cast: string[]
  duration: string
  synopsis: string
  badge?: string
}

export const MOVIES: Movie[] = [
  {
    id: 1,
    title: "Stellar Horizon",
    genre: "Sci-Fi",
    genreList: ["Sci-Fi", "Adventure"],
    rating: 9.1,
    year: 2025,
    poster: "/images/movie-1.jpg",
    rank: 1,
    hot: true,
    badge: "Editor's Pick",
    director: "Sofia Reyes",
    cast: ["Marcus Chen", "Ava Williams", "James Okoro"],
    duration: "2h 28m",
    synopsis:
      "A lone astronaut ventures beyond the known galaxy, discovering an ancient alien civilization that challenges humanity's origins and its destiny among the stars.",
  },
  {
    id: 2,
    title: "Neon Shadows",
    genre: "Thriller",
    genreList: ["Thriller", "Noir"],
    rating: 8.7,
    year: 2025,
    poster: "/images/movie-2.jpg",
    rank: 2,
    hot: true,
    badge: "Trending",
    director: "Luka Petrov",
    cast: ["Elena Voss", "David Park", "Carmen Santos"],
    duration: "1h 58m",
    synopsis:
      "In a rain-soaked city where secrets carry a fatal price, a detective unravels a conspiracy that reaches into the very halls of power — and points back to himself.",
  },
  {
    id: 3,
    title: "Ember Throne",
    genre: "Fantasy",
    genreList: ["Fantasy", "Epic"],
    rating: 8.9,
    year: 2024,
    poster: "/images/movie-3.jpg",
    rank: 3,
    hot: false,
    badge: "Fan Favorite",
    director: "Aria Nakamura",
    cast: ["Thor Bjorn", "Isla Morgan", "Cass Adeyemi"],
    duration: "2h 45m",
    synopsis:
      "When an ancient dragon awakens to reclaim its stolen throne, a forgotten kingdom must choose between extinction and an impossible alliance with their greatest fear.",
  },
  {
    id: 4,
    title: "City of Lights",
    genre: "Drama",
    genreList: ["Drama", "Romance"],
    rating: 8.2,
    year: 2025,
    poster: "/images/movie-4.jpg",
    rank: 4,
    hot: false,
    director: "Leo Fontaine",
    cast: ["Nina Dupont", "Sam Reiter"],
    duration: "1h 52m",
    synopsis:
      "Two strangers meet on a Parisian rooftop under a sky full of possibility, beginning a romance that spans continents and decades.",
  },
  {
    id: 5,
    title: "Glass City",
    genre: "Action",
    genreList: ["Action", "Heist"],
    rating: 8.5,
    year: 2025,
    poster: "/images/movie-5.jpg",
    rank: 5,
    hot: true,
    director: "Ray Castellano",
    cast: ["Jack Novak", "Zara Osei"],
    duration: "2h 10m",
    synopsis:
      "A master thief plans one last job in a city that never forgets. One mistake could bring the whole glass tower crashing down.",
  },
  {
    id: 6,
    title: "The Hollow",
    genre: "Horror",
    genreList: ["Horror", "Thriller"],
    rating: 7.9,
    year: 2024,
    poster: "/images/movie-6.jpg",
    rank: 6,
    hot: false,
    director: "Miles Ashford",
    cast: ["Rosie Tran", "Owen Blake"],
    duration: "1h 44m",
    synopsis:
      "Something ancient lives in the hollow of the forest. Four friends are about to find out why the townspeople never venture past the treeline after dark.",
  },
  {
    id: 7,
    title: "Lost Map",
    genre: "Comedy",
    genreList: ["Comedy", "Adventure"],
    rating: 8.0,
    year: 2025,
    poster: "/images/movie-7.jpg",
    rank: 7,
    hot: false,
    director: "Priya Das",
    cast: ["Max Wild", "Bea Flores"],
    duration: "1h 32m",
    synopsis:
      "A young explorer discovers a magical map that leads deep into a jungle temple — and into a mystery that only a child could solve.",
  },
  {
    id: 8,
    title: "Dawn's Edge",
    genre: "Drama",
    genreList: ["Drama", "War"],
    rating: 8.6,
    year: 2024,
    poster: "/images/movie-8.jpg",
    rank: 8,
    hot: true,
    director: "Victor Stahl",
    cast: ["Kane Okafor", "Elsa Novak"],
    duration: "2h 20m",
    synopsis:
      "At the edge of dawn, a platoon of soldiers face an impossible advance. A story of sacrifice, brotherhood, and the terrible cost of courage.",
  },
]

export const FEATURED_IDS = [1, 2, 3]
export const GENRES = ["All", "Action", "Drama", "Sci-Fi", "Horror", "Comedy", "Fantasy", "Thriller"]
