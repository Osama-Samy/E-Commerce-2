import { FaShoppingBag, FaCreditCard, FaTruck } from "react-icons/fa";
import SectionHeader from "./SectionHeader";


const steps = [
  {
    icon: FaShoppingBag,
    title: "Browse Products",
    description: "Explore our wide range of premium products",
  },
  {
    icon: FaCreditCard,
    title: "Add to Cart",
    description: "Select your favorites and add them to your cart",
  },
  {
    icon: FaTruck,
    title: "Order & Receive",
    description: "Place your order and get it delivered to your doorstep",
  },
];

export default function HowItWorksSection() {
  return (
  
    <section className="bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <SectionHeader title="How It Works" />

        <div className="grid grid-cols-1 gap-10 text-center sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }) => (
            <div key={title}>
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-white/5">
                <Icon className="text-2xl text-indigo-600 dark:text-indigo-400" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {title}
              </h3>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}