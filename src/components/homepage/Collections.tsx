// import React, { useEffect } from 'react';
// import { useProductData } from '@/context/ProductDataContext';

// const Collections = () => {
//   const { categories } = useProductData();

//   // Find the Collections category
//   const collectionsCategory = categories.find(category => category.slug === 'collections');

//   // Filter the subcategories with slugs starting with 'collection-'
//   const collectionCategories = collectionsCategory?.children?.nodes.filter(subCategory =>
//     subCategory.slug.startsWith('collection-')
//   ) || [];

//   useEffect(() => {
//     console.log('Filtered Collection Categories:', categories);
//   }, [categories]);

//   return (
//     <section aria-labelledby="collections-heading" className="bg-gray-100">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
//           <h2 id="collections-heading" className="text-2xl font-bold text-gray-900">
//             Collections
//           </h2>
//           <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
//             {collectionCategories.map((category) => (
//               <div key={category.id} className="group relative">
//                 <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
//                   <img
//                     src={category.image?.mediaItemUrl || 'https://tailwindui.com/img/ecommerce-images/home-page-02-edition-01.jpg'} // Fallback URL
//                     alt={category.name}
//                     className="h-full w-full object-cover object-center"
//                   />
//                 </div>
//                 <h3 className="mt-6 text-sm text-gray-500">
//                   <a href="#">
//                     <span className="absolute inset-0" />
//                     {category.name}
//                   </a>
//                 </h3>
//                 <p className="text-base font-semibold text-gray-900">{category.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Collections;
