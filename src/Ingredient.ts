type Ingredient = {
  name: string,
  description: string,
  colors: Array<string>,
}

const ingredients: {[key in string]: Ingredient} = {
  marigold:     { name: 'marigold',     description: 'luck',        colors: ["orange"] },
  sunflower:    { name: 'sunflower',    description: 'happiness',   colors: ["gold"] },
  lilac:        { name: 'lilac',        description: 'ghosts',      colors: ["violet"] },
  rose:         { name: 'rose',         description: 'passion',     colors: ["red"] },
  sage:         { name: 'sage',         description: 'cleansing',   colors: ["olive"] },
  willow:       { name: 'willow',       description: 'aches',       colors: ["brown"] },
  dogwood:      { name: 'dogwood',      description: 'protection',  colors: ["ghostwhite"] },
  bluebell:     { name: 'bluebell',     description: 'sleep',       colors: ["lightblue"] },
  lemonBalm:    { name: 'lemon balm',   description: 'energy',      colors: ["lemonchiffon"] },
  lavender:     { name: 'lavender',     description: 'memory',      colors: ["purple"] },
}

export { ingredients };
export default Ingredient;
