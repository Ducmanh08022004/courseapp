import { Link } from "react-router-dom";
import styles from "./styles/Course.module.css";

function Course({ id, title, description, image, price }) {
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

  return (
    <Link to={`/course/${id}`} className={styles.card} data-id={id}>
      <div className={styles.image}>
        <img src={image} alt={title} />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
        <div className={styles.price}>{formattedPrice}</div>
      </div>
    </Link>
  );
}

export default Course;
