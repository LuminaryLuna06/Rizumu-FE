export interface Gift {
  id: number;
  image: string;
  price: number;
}

export const gifts: Gift[] = Array.from({ length: 16 }, (_, i) => {
  const id = i + 1;
  let price = 3;
  if (id <= 5) price = 1;
  else if (id <= 10) price = 2;

  return {
    id,
    image: `/gift/gift-${id}.png`,
    price,
  };
});
