import ProductCard from "./product-card";
import axios from "axios";

export default async function Home() {
  const { data } = await axios.get(`http://localhost:5000/products`);
  console.log(data);
  const cards = data;
  return <ProductCard cards={cards} />;
}
