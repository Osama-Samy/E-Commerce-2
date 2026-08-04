import { useEffect, useState } from "react";
import api from "../../api/api";
import {
  FaLaptop,
  FaMobileAlt,
  FaTshirt,
  FaHome,
  FaSpa,
  FaFootballBall,
} from "react-icons/fa";

import CategoryCard from "./CategoryCard";
import SectionHeader from "./SectionHeader";


const categoryData = {
  electronics: {
    title: "Electronics",
    icon: FaLaptop,
    color: "#3B82F6",
  },
  phones: {
    title: "Phones",
    icon: FaMobileAlt,
    color: "#10B981",
  },
  fashion: {
    title: "Fashion",
    icon: FaTshirt,
    color: "#EC4899",
  },
  home: {
    title: "Home",
    icon: FaHome,
    color: "#F59E0B",
  },
  beauty: {
    title: "Beauty",
    icon: FaSpa,
    color: "#8B5CF6",
  },
  sports: {
    title: "Sports",
    icon: FaFootballBall,
    color: "#EF4444",
  },
};

const GRID_CLASSES = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4";

function CategorySkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 p-8">
      <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-slate-100 dark:bg-white/5" />
      <div className="mx-auto mb-2 h-4 w-20 rounded bg-slate-100 dark:bg-white/5" />
      <div className="mx-auto h-3 w-14 rounded bg-slate-100 dark:bg-white/5" />
    </div>
  );
}

export default function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const { data } = await api.get("/products");

      const products = data.products || [];

      const counts = {};

      products.forEach((product) => {
        const key = product.category?.toLowerCase();

        if (!key) return;

        counts[key] = (counts[key] || 0) + 1;
      });

      const result = Object.keys(counts)
        .filter((key) => categoryData[key])
        .map((key) => ({
          slug: key,
          count: counts[key],
          ...categoryData[key],
        }));

      setCategories(result);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
   
    <section id="categories" className="bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader
          title="Shop by Category"
          subtitle="Browse our wide range of categories"
        />

        {loading ? (
          <div className={GRID_CLASSES}>
            {Array.from({ length: 4 }).map((_, i) => (
              <CategorySkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className={GRID_CLASSES}>
            {categories.map((category) => (
              <CategoryCard key={category.slug} {...category} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}