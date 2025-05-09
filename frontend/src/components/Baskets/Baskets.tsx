import { Link } from "react-router";

interface BasketsProps {
  baskets: Array<string>;
}

const Baskets = ({ baskets }: BasketsProps) => {
  return (
    <>
      <div id="baskets">
        <h3>My Baskets</h3>

        <ul className="basket-list">
          {baskets.map((basketName) => (
            <li key={basketName}>
              <Link to={`/baskets/${basketName}`}>{basketName}</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Baskets;
