import ProductCard from "./product-card";
import axios from "axios";

export default async function Home() {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products`);
  console.log(data);
  const cards = data;
  return <ProductCard cards={cards} />;
}
