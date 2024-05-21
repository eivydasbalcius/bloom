import Image from 'next/image';
import { useRouter } from 'next/router';

const offers = [
  { name: "Grąžink prekes kai esi pasiruošęs", description: '100 dienų nemokamas grąžinimas', href: '#' },
  { name: 'Prenumeruok naujienlaiškį', description: 'ir gauk 15% nuolaidą primam apsipirkimui', href: '#', scrollTo: 'sale' },
]

interface HeroProps {
  onScrollToSection: (sectionId: string) => void;
}


const Hero: React.FC<HeroProps> = ({ onScrollToSection }) => {
  const router = useRouter();

  const handleSeeProductsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/products');
  }
  return (
    <div className="flex flex-col border-b border-gray-200 lg:border-0">
      <nav aria-label="Offers" className="order-last lg:order-first">
        <div className="mx-auto">
          <ul
            role="list"
            className="grid grid-cols-1 divide-y divide-gray-200 lg:grid-cols-2 lg:divide-x lg:divide-y-0"
          >
            {offers.map((offer) => (
              <li key={offer.name} className="flex flex-col">
                <a
                  href={offer.href}
                  className="relative flex flex-1 flex-col justify-center bg-white px-4 py-6 text-center focus:z-10"
                  onClick={(e) => {
                    e.preventDefault();
                    if (offer.scrollTo) {
                      onScrollToSection(offer.scrollTo);
                    }
                  }}
                >
                  <p className="text-sm text-gray-500">{offer.name}</p>
                  <p className="font-semibold text-gray-900">{offer.description}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="relative">
        <div aria-hidden="true" className="absolute hidden h-full w-1/2 bg-gray-100 lg:block" />
        <div className="relative bg-gray-100 lg:bg-transparent">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-2 lg:px-8">
            <div className="mx-auto max-w-2xl py-24 lg:max-w-none lg:py-64">
              <div className="lg:pr-16">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl xl:text-6xl">
                  Naujausios prekės kiekvinam stiliui
                </h1>
                <p className="mt-4 text-xl text-gray-600">
                  Peržiūrėk mūsų naujausias kolekcijas ir atrask sau tinkamiausią stilių.
                </p>
                <div className="mt-6">
                  <a
                    onClick={handleSeeProductsClick}
                    className="inline-block rounded-md border border-transparent bg-indigo-600 px-8 py-3 font-medium text-white hover:bg-indigo-700 cursor-pointer"
                  >
                    Peržiūrėk naujausią kolekciją
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-48 w-full sm:h-64 lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-1/2">
          <Image
            src="/hero.jpg"
            alt="Featured collection"
            className="h-full w-full object-cover object-center"
            width={832}
            height={777}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;