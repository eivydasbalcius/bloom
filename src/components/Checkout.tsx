import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { RadioGroup } from '@headlessui/react'
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/20/solid'
import { useSession } from "next-auth/react";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Image from 'next/image';
import Swal from 'sweetalert2';

interface CartItem {
  productId: number;
  quantity: number;
  price: number;
  image: string;
  name: string;
  attributes: {
    color: string | null;
    size: string | null;
  };
}

interface Customer {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

interface FormData extends Customer {
  cardNumber: string;
  nameOnCard: string;
  expirationDate: string;
  cvc: string;
}

const deliveryMethods = [
  { id: 1, title: 'Standartinis', turnaround: '3-7 Darbo dienos', price: 'Nemokamas' },
  { id: 2, title: 'Greitasis', turnaround: '1–3 Darbo dienos', price: '15.00€' },
]
const paymentMethods = [
  { id: 'credit-card', title: 'Kreditine kortele' },
  { id: 'paypal', title: 'PayPal' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
const Checkout = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(deliveryMethods[0]);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>();


  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const cartData = sessionStorage.getItem('cart');
    const parsedCartData: CartItem[] = cartData ? JSON.parse(cartData) : [];
    setCart(parsedCartData);
    recalculateTotals(parsedCartData);
  }, []);

  const recalculateTotals = (cart: CartItem[]) => {
    const subTotal = cart.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0);
    const tax = subTotal * 0.092;
    const totalAmount = subTotal + tax;

    setSubtotal(parseFloat(subTotal.toFixed(2)));
    setTaxes(parseFloat(tax.toFixed(2)));
    setTotal(parseFloat(totalAmount.toFixed(2)));
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const updatedCart = cart.map((item, i) =>
      i === index ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));

    // Recalculate totals
    const subTotal = updatedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subTotal * 0.092;
    const totalAmount = subTotal + tax;
    setSubtotal(parseFloat(subTotal.toFixed(2)));
    setTaxes(parseFloat(tax.toFixed(2)));
    setTotal(parseFloat(totalAmount.toFixed(2)));

    // Dispatch custom event to update cart quantity in Header
    const event = new CustomEvent('cart-updated');
    window.dispatchEvent(event);
  };

  const handleRemoveItem = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
    recalculateTotals(updatedCart);
  };

  const onSubmit = async (data: Customer) => {
    setLoading(true);
    const customer: Customer = {
      firstName: data.firstName,
      lastName: data.lastName,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      state: data.state,
      postcode: data.postcode,
      country: data.country,
      email: data.email,
      phone: data.phone,
    };

    // if (!selectedDeliveryMethod) {
    //   setError('deliveryMethod', {
    //     type: 'manual',
    //     message: 'Pristatymo būdas yra privalomas',
    //   });
    //   setLoading(false);
    //   return;
    // }

    try {
      const response = await axios.post('/api/order', {
        cart: cart.map(item => ({
          id: item.productId, // Ensure this is the correct product ID
          quantity: item.quantity,
        })),
        customer,
      });
      console.log('Order created successfully:', response.data);

      // Display SweetAlert on success
      Swal.fire({
        icon: 'success',
        title: 'Užsakymas sėkmingai sukurtas',
        text: 'Dėkojame už jūsų užsakymą!',
      }).then(() => {
        sessionStorage.removeItem('cart');
        setCart([]);
        router.push('/');
        router.replace(router.asPath);
      });

    } catch (error) {
      console.log('customer data:', customer);
      console.log('cart data:', cart);
      console.error('Error creating order:', error);
    }
    finally {
      setLoading(false);
    }
  };


  if (status === 'loading' || status === 'unauthenticated') {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Checkout</h2>

        <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">Kontaktinė informacija</h2>

              <div className="mt-4">
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                  El. paštas*
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email-address"
                    value={session?.user?.email || ''}
                    {...register('email', { required: 'Šis laukelis yra privalomas' })}
                    autoComplete="email"
                    // disabled={true}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                  />
                  {errors.email && <span className="text-red-600">{errors.email.message}</span>}
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-gray-200 pt-10">
              <h2 className="text-lg font-medium text-gray-900">Pristatymo informacija</h2>

              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                    Vardas*
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="first-name"
                      {...register('firstName', { required: 'Šis laukelis yra privalomas' })}
                      autoComplete="given-name"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                    />
                    {errors.firstName && <span className="text-red-600">{errors.firstName.message}</span>}
                  </div>
                </div>

                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                    Pavardė*
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="last-name"
                      {...register('lastName', { required: 'Šis laukelis yra privalomas' })}
                      autoComplete="family-name"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                    />
                    {errors.lastName && <span className="text-red-600">{errors.lastName.message}</span>}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Pilnas adresas*
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="address"
                      {...register('address1', { required: 'Šis laukelis yra privalomas' })}
                      autoComplete="street-address"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                    />
                    {errors.address1 && <span className="text-red-600">{errors.address1.message}</span>}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="apartment" className="block text-sm font-medium text-gray-700">
                    Pilnas adresas 2
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="apartment"
                      {...register('address2')}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    Miestas*
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="city"
                      {...register('city', { required: 'Šis laukelis yra privalomas' })}
                      autoComplete="address-level2"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                    />
                    {errors.city && <span className="text-red-600">{errors.city.message}</span>}
                  </div>
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Šalis*
                  </label>
                  <div className="mt-1">
                    <select
                      id="country"
                      {...register('country', { required: 'Pasirinkite šalį' })}
                      autoComplete="country-name"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                    >
                      <option value="">Pasirinkite šalį</option>
                      <option value="Albania">Albanija</option>
                      <option value="Andorra">Andora</option>
                      <option value="Armenia">Armėnija</option>
                      <option value="Austria">Austrija</option>
                      <option value="Azerbaijan">Azerbaidžanas</option>
                      <option value="Belarus">Baltarusija</option>
                      <option value="Belgium">Belgija</option>
                      <option value="Bosnia and Herzegovina">Bosnija ir Hercegovina</option>
                      <option value="Bulgaria">Bulgarija</option>
                      <option value="Croatia">Kroatija</option>
                      <option value="Cyprus">Kipras</option>
                      <option value="Czech Republic">Čekija</option>
                      <option value="Denmark">Danija</option>
                      <option value="Estonia">Estija</option>
                      <option value="Finland">Suomija</option>
                      <option value="France">Prancūzija</option>
                      <option value="Georgia">Gruzija</option>
                      <option value="Germany">Vokietija</option>
                      <option value="Greece">Graikija</option>
                      <option value="Hungary">Vengrija</option>
                      <option value="Iceland">Islandija</option>
                      <option value="Ireland">Airija</option>
                      <option value="Italy">Italija</option>
                      <option value="Kazakhstan">Kazachstanas</option>
                      <option value="Kosovo">Kosovas</option>
                      <option value="Latvia">Latvija</option>
                      <option value="Liechtenstein">Lichtenšteinas</option>
                      <option value="Lithuania">Lietuva</option>
                      <option value="Luxembourg">Liuksemburgas</option>
                      <option value="Malta">Malta</option>
                      <option value="Moldova">Moldova</option>
                      <option value="Monaco">Monakas</option>
                      <option value="Montenegro">Juodkalnija</option>
                      <option value="Netherlands">Nyderlandai</option>
                      <option value="North Macedonia">Šiaurės Makedonija</option>
                      <option value="Norway">Norvegija</option>
                      <option value="Poland">Lenkija</option>
                      <option value="Portugal">Portugalija</option>
                      <option value="Romania">Rumunija</option>
                      <option value="San Marino">San Marinas</option>
                      <option value="Serbia">Serbija</option>
                      <option value="Slovakia">Slovakija</option>
                      <option value="Slovenia">Slovėnija</option>
                      <option value="Spain">Ispanija</option>
                      <option value="Sweden">Švedija</option>
                      <option value="Switzerland">Šveicarija</option>
                      <option value="Turkey">Turkija</option>
                      <option value="Ukraine">Ukraina</option>
                      <option value="United Kingdom">Jungtinė Karalystė</option>
                      <option value="Vatican City">Vatikano Miestas</option>
                    </select>
                    {errors.country && <span className="text-red-600">{errors.country.message}</span>}
                  </div>
                </div>

                <div>
                  <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                    Regionas
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="region"
                      {...register('state')}
                      autoComplete="address-level1"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
                    Pašto kodas*
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="postal-code"
                      {...register('postcode', { required: 'Pašto kodas yra privalomas' })}
                      autoComplete="postal-code"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                    />
                    {errors.postcode && <span className="text-red-600">{errors.postcode.message}</span>}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Tel. numeris*
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="phone"
                      {...register('phone', { required: 'Šis laukelis yra privalomas' })}
                      autoComplete="tel"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                    />
                    {errors.phone && <span className="text-red-600">{errors.phone.message}</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-gray-200 pt-10">
              <RadioGroup value={selectedDeliveryMethod} onChange={setSelectedDeliveryMethod}>
                <RadioGroup.Label className="text-lg font-medium text-gray-900">Pristatymas</RadioGroup.Label>

                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  {deliveryMethods.map((deliveryMethod) => (
                    <RadioGroup.Option
                      key={deliveryMethod.id}
                      value={deliveryMethod}
                      className={({ checked, active }) =>
                        classNames(
                          checked ? 'border-transparent' : 'border-gray-300',
                          active ? 'ring-2 ring-indigo-500' : '',
                          'relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none'
                        )
                      }
                    >
                      {({ checked, active }) => (
                        <>
                          <span className="flex flex-1">
                            <span className="flex flex-col">
                              <RadioGroup.Label as="span" className="block text-sm font-medium text-gray-900">
                                {deliveryMethod.title}
                              </RadioGroup.Label>
                              <RadioGroup.Description
                                as="span"
                                className="mt-1 flex items-center text-sm text-gray-500"
                              >
                                {deliveryMethod.turnaround}
                              </RadioGroup.Description>
                              <RadioGroup.Description as="span" className="mt-6 text-sm font-medium text-gray-900">
                                {deliveryMethod.price}
                              </RadioGroup.Description>
                            </span>
                          </span>
                          {checked ? <CheckCircleIcon className="h-5 w-5 text-indigo-600" aria-hidden="true" /> : null}
                          <span
                            className={classNames(
                              active ? 'border' : 'border-2',
                              checked ? 'border-indigo-500' : 'border-transparent',
                              'pointer-events-none absolute -inset-px rounded-lg'
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
              {selectedDeliveryMethod ? null : <span className="text-red-600">Pristatymo būdas yra privalomas</span>}
            </div>

            {/* Payment */}
            <div className="mt-10 border-t border-gray-200 pt-10">
              <h2 className="text-lg font-medium text-gray-900">Apmokėjimo būdai</h2>

              <fieldset className="mt-4">
                <legend className="sr-only">Kreditine kortele</legend>
                <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                  {paymentMethods.map((paymentMethod, paymentMethodIdx) => (
                    <div key={paymentMethod.id} className="flex items-center">
                      {paymentMethodIdx === 0 ? (
                        <input
                          id={paymentMethod.id}
                          name="payment-type"
                          type="radio"
                          defaultChecked
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      ) : (
                        <input
                          id={paymentMethod.id}
                          name="payment-type"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      )}

                      <label htmlFor={paymentMethod.id} className="ml-3 block text-sm font-medium text-gray-700">
                        {paymentMethod.title}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>

              <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
                <div className="col-span-4">
                  <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                    Kreditinės kortelės numeris
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="card-number"
                      {...register('cardNumber', { required: 'Kreditinės kortelės numeris yra privalomas', pattern: { value: /^\d{16}$/, message: 'Neteisingas kreditinės kortelės numeris' } })}
                      autoComplete="cc-number"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                    />
                    {errors.cardNumber && <span className="text-red-600">{errors.cardNumber.message}</span>}

                  </div>
                </div>

                <div className="col-span-4">
                  <label htmlFor="name-on-card" className="block text-sm font-medium text-gray-700">
                    Vardas ir Pavardė
                  </label>
                  <div className="mt-1">

                    <input
                      type="text"
                      id="name-on-card"
                      {...register('nameOnCard', { required: 'Vardas ir Pavardė yra privalomi' })}
                      autoComplete="cc-name"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                    />
                    {errors.nameOnCard && <span className="text-red-600">{errors.nameOnCard.message}</span>}

                  </div>
                </div>

                <div className="col-span-3">
                  <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">
                    Galiojimo data (MM/YY)
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="expiration-date"
                      {...register('expirationDate', { required: 'Galiojimo data yra privaloma', pattern: { value: /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/, message: 'Neteisinga galiojimo data (MM/YY)' } })}
                      autoComplete="cc-exp"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                    />
                    {errors.expirationDate && <span className="text-red-600">{errors.expirationDate.message}</span>}

                  </div>
                </div>

                <div>
                  <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                    CVC
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="cvc"
                      {...register('cvc', { required: 'CVC yra privalomas', pattern: { value: /^\d{3,4}$/, message: 'Neteisingas CVC kodas' } })}
                      autoComplete="csc"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-700"
                    />
                    {errors.cvc && <span className="text-red-600">{errors.cvc.message}</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="mt-10 lg:mt-0">
            <h2 className="text-lg font-medium text-gray-900">Pirkinių krepšelis</h2>

            <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
              <h3 className="sr-only">Items in your cart</h3>
              <ul role="list" className="divide-y divide-gray-200">
                {cart.map((product, index) => (
                  <li key={index} className="flex px-4 py-6 sm:px-6">
                    <div className="flex-shrink-0">
                      <Image src={product.image} alt={product.name} className="w-20 rounded-md" width={80} height={80} />
                    </div>
                    <div className="ml-6 flex flex-1 flex-col">
                      <div className="flex">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm">
                            <a className="font-medium text-gray-700 hover:text-gray-800">
                              {product.name}
                            </a>
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">{product.attributes.color}</p>
                          <p className="mt-1 text-sm text-gray-500">{product.attributes.size}</p>
                        </div>
                        <div className="ml-4 flow-root flex-shrink-0">
                          <button
                            type="button"
                            className="-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <span className="sr-only">Remove</span>
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-1 items-end justify-between pt-2">
                        <p className="mt-1 text-sm font-medium text-gray-900">{product.price} €</p>
                        <div className="ml-4">
                          <label htmlFor={`quantity-${index}`} className="sr-only">
                            Kiekis
                          </label>
                          <select
                            id={`quantity-${index}`}
                            name="quantity"
                            value={product.quantity}
                            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                            className="rounded-md border border-gray-300 text-left text-base font-medium shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm text-gray-700"
                          >
                            {[...Array(10)].map((_, i) => (
                              <option key={i} value={i + 1}>{i + 1}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-black">Tarpinė suma</dt>
                  <dd className="text-sm font-medium text-gray-900">{subtotal} €</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-black">Mokesčiai</dt>
                  <dd className="text-sm font-medium text-gray-900">{taxes} €</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-black">Pristaymas</dt>
                  <dd className="text-sm font-medium text-gray-900">0,00 €</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <dt className="text-base font-medium text-black">Galutinė kaina</dt>
                  <dd className="text-base font-medium text-gray-900">{total} €</dd>
                </div>
              </dl>
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <button
                  type="submit"
                  className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                  disabled={loading}
                >
                  {loading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white mx-auto"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                  ) : (
                    'Patvirtinti užsakymą'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
