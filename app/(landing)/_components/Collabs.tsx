import Image from "next/image";

export default function Collabs() {
  const collabs = [
    {
      title: "Urban Comfort Collection",
      brand: "Adidas x Yeezy",
      description: "Streetwear essentials with a luxe twist",
    },
    {
      title: "Tech-Infused Sportswear",
      brand: "Nike x Apple",
      description: "Smart fabrics meet cutting-edge design",
    },
    {
      title: "Retro Revival",
      brand: "Puma x Fila",
      description: "90s-inspired athleisure for the modern era",
    },
  ];

  return (
    <section className="w-full bg-gray-100 py-12 md:py-24 lg:py-32">
      <div className="mx-auto max-w-screen-xl px-4 md:px-6">
        <div className="mb-20 flex flex-col items-center justify-between md:flex-row">
          <div>
            <h2 className="mb-4 text-3xl font-bold uppercase tracking-tighter text-gray-900 sm:text-4xl">
              Streetwear Collaborations
            </h2>

            <p className="max-w-[600px] text-gray-600">
              Exclusive partnerships bringing you the best in urban style and
              comfort.
            </p>
          </div>

          <div className="relative mt-6 h-72 w-72 overflow-hidden md:mt-0">
            <Image
              fill
              className="object-cover"
              alt="Eco-friendly fashion"
              src="/images/trendingStyles/SportyComfort.png"
            />
          </div>
        </div>

        <div className=" grid gap-6 md:grid-cols-3">
          {collabs.map((collab, index) => (
            <div
              key={index}
              className=" bg-white p-6 shadow-sm transition-shadow duration-200 ease-in-out hover:shadow-md"
            >
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {collab.title}
              </h3>
              <p className="mb-2 text-sm text-gray-600">{collab.brand}</p>
              <p className="text-sm text-gray-700">{collab.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
