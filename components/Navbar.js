"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './Navbar.css'; // Ensure your custom CSS is properly imported
import { useSession, signOut } from "next-auth/react";
import productsData from '@/public/products.json'; // Import your products data
import SessionWrapper from './SessionWrapper';
const Navbar = () => {
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false); // State for dropdown menu
    const { data: session } = useSession();

    const toggleSearch = () => {
        setSearchVisible(!searchVisible);
    };

    useEffect(() => {
        // Ensure the lordicon script is loaded
        const script = document.createElement('script');
        script.src = 'https://cdn.lordicon.com/lordicon.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSignOut = () => {
        // Clear cart from localStorage
        localStorage.removeItem('cart');
        localStorage.removeItem('order');
        // Sign out
        signOut();
    };
    const handleSearchChange = (e) => {
        const searchTerm = e.target.value.toLowerCase(); // Convert search term to lowercase
        setSearchTerm(searchTerm);
        
        if (searchTerm === "") {
            setSearchResults([]);
        } else {
            const filteredProducts = productsData.filter(product => {
                const productName = product.name ? product.name.toString().toLowerCase() : ""; // Ensure product name is a string
                return productName.includes(searchTerm);
            });
            setSearchResults(filteredProducts);
        }
    };
    
    

    const handleSearchResultClick = (productId) => {
        // Navigate to the product page
        window.location.href = `/product/${productId}`;
        setSearchVisible(false);
    };

    return (
        <nav className='nav flex flex-wrap justify-between items-center w-full bg-sky-200 sticky top-0 p-4 z-50'>
            <ul className='flex flex-wrap gap-4 md:gap-10 items-center w-full md:w-auto'>
                <li>
                    <Link href='/' className="logo">
                        <Image className='w-8 h-8 md:w-12 md:h-12' width={180} height={180} src='/logo.png' alt='Logo' />
                    </Link>
                </li>
                <li>
                    <Link href='/' className='cursor-pointer font-semibold text-red-500 text-sm md:text-xl hover:text-red-600 hover:font-bold'>Home</Link>
                </li>
                <li>
                    <Link href='/categories' className='cursor-pointer font-semibold text-red-500 text-sm md:text-xl hover:text-red-600 hover:font-bold'>Categories</Link>
                </li>
                <li>
                    <Link href='/about' className='cursor-pointer font-semibold text-red-500 text-sm md:text-xl hover:text-red-600 hover:font-bold'>About Us</Link>
                </li>
                <li>
                    <Link href='/contact' className='cursor-pointer font-semibold text-red-500 text-sm md:text-xl hover:text-red-600 hover:font-bold'>Contact Us</Link>
                </li>
            </ul>
            <div className="side flex gap-4 md:gap-6 items-center w-96 mt-4 md:mt-0 md:w-auto relative">
                <div className="search flex items-center gap-2 w-full md:w-auto relative">
                    <div className={`search-container ${searchVisible ? 'visible' : ''} w-full md:w-auto`}>
                        <input
                            type="text"
                            className="p-2 border-2 border-black rounded w-full bg-sky-100 text-black"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="searchicon flex flex-col cursor-pointer" onClick={toggleSearch}>
                        <lord-icon
                            src="https://cdn.lordicon.com/fkdzyfle.json"
                            trigger="hover"
                            style={{ width: '25px', height: '25px' }}
                        />
                        <p className='text-sm'>Search</p>
                    </div>
                    <Link href='/cart'>
                        <div className="cart flex flex-col cursor-pointer">
                            <lord-icon
                                src="https://cdn.lordicon.com/pbrgppbb.json"
                                trigger="hover"
                                style={{ width: '25px', height: '25px' }}
                            />
                            <p className='text-sm'>Cart</p>
                        </div>
                    </Link>
                </div>
                {session ? (
                    <div className="dropdown relative w-full md:w-auto">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            id="dropdownDefaultButton"
                            className="mx-3 text-customPink bg-pink-200 border-customPink border-2 hover:bg-pink-200 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-5 text-center inline-flex items-center dark:bg-pink-200 dark:hover:bg-pink-200 dark:focus:ring-customPink w-full md:w-auto"
                            type="button"
                        >
                            Welcome, {session.user.name}
                            <svg className="w-2.5 h-2.5 md:ml-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                            </svg>
                        </button>
                        <div
                            className={`dropdown-menu ${showDropdown ? "block" : "hidden"} absolute top-12 right-3 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-pink-200 w-full md:w-auto`}
                        >
                            <ul className="py-2 text-sm text-customPink dark:text-gray-200 w-full md:w-auto" aria-labelledby="dropdownDefaultButton">
                                <li>
                                    <Link href="/cart" className="block px-4 py-2 hover:bg-customPink dark:hover:bg-customPink dark:hover:text-white text-customPink">My Cart</Link>
                                </li>
                                <li>
                                    <Link href="/orders" className="block px-4 py-2 hover:bg-customPink dark:hover:bg-customPink dark:hover:text-white text-customPink">My Orders</Link>
                                </li>
                                <li>
                                    <Link href='/contact' className="block px-4 py-2 hover:bg-customPink dark:hover:bg-customPink dark:hover:text-white text-customPink">Contact Us</Link>
                                </li>
                                <li>
                                    <button
                                        onClick={handleSignOut}
                                        className="block w-full text-left px-4 py-2 hover:bg-customPink text-customPink text-semibold dark:hover:bg-customPink dark:hover:text-white"
                                    >
                                        Sign out
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="icons flex gap-4 md:gap-6 w-full md:w-auto">
                        <div className="user flex flex-col cursor-pointer">
                            <button onClick={toggleDropdown}>
                                <lord-icon
                                    src="https://cdn.lordicon.com/hrjifpbq.json"
                                    trigger="hover"
                                    style={{ width: '25px', height: '25px' }}
                                />
                                <p className='text-sm'>User</p>
                            </button>
                        </div>
                        {isOpen && (
                            <div className="absolute right-0 top-24 md:top-16 mt-2 w-48 bg-pink-200 border border-gray-200 shadow-lg rounded-md z-10">
                                <div className="py-1">
                                    <Link href="/login">
                                        <div className="block px-4 py-2 text-customPink font-bold hover:text-white hover:bg-customPink">Login</div>
                                    </Link>
                                    <Link href="/signup">
                                        <div className="block px-4 py-2 text-customPink font-bold hover:text-white hover:bg-customPink">Sign Up</div>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {searchVisible && (
    <div 
        className={`search-results w-[20vw] absolute ${session ? 'lg:left-[64vw]' : 'lg:left-[76vw]'} lg:top-[8vh] top-[11vh] sm:top-[10vh] md:left-10 md:top-28 bg-gray-500 text-white rounded-lg shadow-lg`}
    >
        {searchResults.length > 0 ? (
            searchResults.map((product) => (
                <div 
                    key={product.id} 
                    className="bg-gray-500 px-4 py-2 hover:bg-gray-600 cursor-pointer w-[15vw] md:w-[20vw] lg:w-[15vw]"
                    onClick={() => handleSearchResultClick(product.id)}
                >
                    {product.name}
                </div>
            ))
        ) : (
            <div className="w-[15vw] md:w-[20vw] lg:w-[15vw] px-4 py-2 text-center">No results found.</div>
        )}
    </div>
)}


        </nav>
    );
}

export default SessionWrapper(Navbar);
