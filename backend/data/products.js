const products = [
  {
    name: "Gibson Les Paul Voodoo",
    image: "/images/voodoo.webp",
    description:
      "Les Paul Voodoo with the mojo sound and juju look. The Gibson classic has been given a conjure treatment: swamp ash body (for lighter weight), ebony fingerboard with a unique red pearl voodoo skull at the 5th fret, 496R and 500T pickups, and black hardware. The finish is painted ebony, then rubbed with a red filler that catches in the grooved of the ash wood grain, and finally sealed with a satin-lacquer finish coat.",
    brand: "Gibson",
    category: "Electric Guitars",
    price: 2999.99,
    countInStock: 2,
    rating: 4.5,
    condition: "Good",
    sampleReviews: [
      { rating: 5, comment: "Sustain for days and that red-filled ash grain looks even better in person." },
      { rating: 4, comment: "Heavy-ish, but the 500T bridge pickup is a monster for drop tunings." },
    ],
    numReviews: 12,
  },
  {
    name: "Schecter Reaper-6 FR-S - Satin Charcoal Burst",
    image: "/images/reaper.webp",
    description:
      "Whether you play rock, metal, or fusion, the Schecter Reaper-6 FR S is a force to be reckoned with. This red-hot axe features a resonant poplar-burl-topped swamp ash body, ensuring maximum natural tone and killer looks. A high-output Diamond Decimator bridge humbucker makes the Reaper-6 FR S the sonic equivalent of a flame thrower but still gives you enough versatility to cover all of your tonal bases. What's more, Schecter gave the Reaper-6 FR S an ultra-cool Sustainiac neck pickup that lets you pull off flying solos like nothing else out there. As for comfort, after experiencing this guitar's sleek body contours, Ultra-access Neck Carve, and fast-playing ebony fingerboard, you'll have a hard time putting it down. The Reaper-6 FR S includes a Floyd Rose 1500 tremolo for rock-solid intonation. Eye-catching black and chrome hardware completes the package. This is one Reaper that you'll want to meet.",
    brand: "Schecter",
    category: "Electric Guitars",
    price: 1199.99,
    countInStock: 7,
    rating: 4.0,
    condition: "New",
    sampleReviews: [
      { rating: 4, comment: "Arrived set up perfectly. The Sustainiac takes some practice but it’s addictive." },
      { rating: 4, comment: "Floyd stays in tune through dive bombs. Great value." },
    ],
    numReviews: 8,
  },
  {
    name: "Gibson Historic Series 60s Hummingbird Acoustic 2000s - Cherry Sunburst",
    image: "/images/hbird.webp",
    description:
      "Introduced in 1960 as Gibson's first square-shoulder, the Hummingbird™ arrived at the dawn of a new era in music and was rapidly embraced by the prime movers on the scene. Built with a thermally aged Sitka spruce top, the 1960 Hummingbird reflects the appearance and performance of those early icons. Featuring a fixed bridge, it's finished with Gibson's new Thin Finish, including a hand-rubbed VOS process.",
    brand: "Gibson",
    category: "Acoustic Guitars",
    price: 929.99,
    countInStock: 1,
    rating: 3,
    condition: "Good",
    sampleReviews: [
      { rating: 3, comment: "Gorgeous tone, though the neck is chunkier than I expected." },
      { rating: 4, comment: "Sounds bigger every week as it opens up." },
    ],
    numReviews: 12,
  },
  {
    name: "Vintage 1955 Martin 0-15",
    image: "/images/martin.jpg",
    description:
      "Here is a vintage 1955 Martin 0-15 acoustic guitar, made in the USA. The serial # is 1504XX. This guitar is in good condition for its age. It has some nicks, scratches, and dings. It has a repaired crack above the pick guard. The neck is straight. The frets show no real wear. The bridge is pulling some. The action is good, if you want to lower it, it has room to lower the saddle. Included is a new hard shell case. This is a great guitar for any player or collector!",
    brand: "Martin",
    category: "Acoustic Guitars",
    price: 2499.99,
    countInStock: 1,
    rating: 5,
    condition: "Good",
    sampleReviews: [
      { rating: 5, comment: "Played-in mahogany warmth you can’t fake. The crack repair is solid." },
      { rating: 5, comment: "My favorite guitar in the house now. Worth every penny." },
    ],
    numReviews: 12,
  },
  {
    name: "Fender P-bass 2022 - Black",
    image: "/images/pbass.webp",
    description: "In like new condition, with no visible signs of use.",
    brand: "Fender",
    category: "Bass Guitars",
    price: 699.99,
    countInStock: 1,
    rating: 3.5,
    condition: "Like New",
    sampleReviews: [
      { rating: 4, comment: "Classic P thump, basically new. Packed really well." },
      { rating: 3, comment: "Great bass, but I wish it came with a case." },
    ],
    numReviews: 10,
  },
  {
    name: "Hopf 1960s Classical Guitar",
    image: "/images/hopf.jpg",
    description: "Well used with multiple scratches, scrapes, worn off finish and a few gaps at neck and lower bout. A good project guitar",
    brand: "Hopf",
    category: "Acoustic Guitars",
    price: 149.99,
    countInStock: 0,
    rating: 4,
    condition: "As Is",
    sampleReviews: [
      { rating: 4, comment: "Lovely little nylon-string for the price, just needed new strings." },
      { rating: 3, comment: "Some cosmetic wear as described. Plays fine." },
    ],
    numReviews: 12,
  },
];

export default products;
