/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { HoverBorderGradient } from "./ui/hover-border-gradient";

interface Recipe {
  idMeal: number;
  strMeal: string;
  strMealThumb: string | StaticImport;
}
interface Name {
  idMeal: number;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string | StaticImport;
}

function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipeByName, setRecipeByName] = useState<Name[]>([]);
  const [searchByName, setSearchByName] = useState("");
  const [searchByArea, setSearchByArea] = useState("");
  const [searchByCategory, setSearchByCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Function to fetch recipes by category
  const fetchRecipesByCategory = async () => {
    setLoading(true);
    try {
      const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchByCategory}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      setRecipes(data.meals || []);
    } catch (error) {
      console.error("Error fetching data by category:", error);
    }
    setLoading(false);
  };

  // Function to fetch recipes by meal name (search input)
  const fetchRecipesByName = async () => {
    setLoading(true);
    try {
      const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchByName}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      setRecipeByName(data.meals || []);
    } catch (error) {
      console.error("Error fetching data by name:", error);
    }
    setLoading(false);
  };

  // Function to fetch recipes by area
  const fetchRecipesByArea = async () => {
    setLoading(true);
    try {
      const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${searchByArea}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      setRecipes(data.meals || []);
    } catch (error) {
      console.error("Error fetching data by area:", error);
    }
    setLoading(false);
  };

  // Handle scroll logic for Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (searchByName) {
      fetchRecipesByName();
    } else if (searchByCategory) {
      fetchRecipesByCategory();
    } else if (searchByArea) {
      fetchRecipesByArea();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchByName,searchByCategory,searchByArea]);

  // // Handle search submission logic
  // const handleSubmit = () => {
  //   if (searchByName) {
  //     fetchRecipesByName();
  //   } else if (searchByCategory) {
  //     fetchRecipesByCategory();
  //   } else if (searchByArea) {
  //     fetchRecipesByArea();
  //   }
  // };

  // Reset search fields
  const handleReset = () => {
    setSearchByArea("");
    setSearchByCategory("");
    setSearchByName("");
    setRecipes([]);
    setRecipeByName([]);
  };

  return (
    <div className="container">
      <h1 className="title">Recipe List</h1>

      <div className="filter-section">
        <input
          type="text"
          placeholder="Search Recipes By Name"
          value={searchByName}
          onChange={(e) => setSearchByName(e.target.value)}
          className="search-input text-black"
        />

        <input
          type="text"
          placeholder="Search Recipes By Category"
          value={searchByCategory}
          onChange={(e) => setSearchByCategory(e.target.value)}
          className="search-input text-black"
        />

        <input
          type="text"
          placeholder="Search Recipes By Area"
          value={searchByArea}
          onChange={(e) => setSearchByArea(e.target.value)}
          className="search-input text-black"
        />
      </div>

      <div className="button-section flex items-center justify-evenly">
        {/* <HoverBorderGradient
          containerClassName="rounded-full"
          as="button"
          className="dark:bg-black bg-white text-black dark:text-white px-8 py-4 font-extrabold text-md"
          onClick={handleSubmit}
        >
          Get Recipe
        </HoverBorderGradient> */}
        <HoverBorderGradient
          containerClassName="rounded-full"
          as="button"
          className="dark:bg-black bg-white text-black dark:text-white px-8 py-4 font-extrabold text-md"
          onClick={handleReset}
        >
          Clear
        </HoverBorderGradient>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="recipe-list m-4">
          {recipes.length > 0 ? (
            recipes.map((recipe: Recipe) => (
              <div key={recipe.idMeal} className="recipe-card">
                <Link href={`/recipe/${recipe.idMeal}`}>
                  <div>
                    <Image
                      src={recipe.strMealThumb}
                      alt={recipe.strMeal}
                      width={200}
                      height={200}
                      className="recipe-image"
                    />
                    <h2 className="recipe-title text-black">
                      {recipe.strMeal}
                    </h2>
                  </div>
                </Link>
              </div>
            ))
          ) : recipeByName.length > 0 ? (
            recipeByName.map((recipeName: Name) => (
              <div key={recipeName.idMeal} className="recipe-card">
                <Link href={`/recipe/${recipeName.idMeal}`}>
                  <div>
                    <Image
                      src={recipeName.strMealThumb}
                      alt={recipeName.strMeal}
                      width={200}
                      height={200}
                      className="recipe-image"
                    />
                    <h2 className="recipe-title text-black">
                      {recipeName.strMeal}
                    </h2>
                    <p className="recipe-category text-black">
                      {recipeName.strCategory}
                    </p>
                    <p className="recipe-category text-black">
                      {recipeName.strInstructions}
                    </p>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p className="no-results flex justify-center items-center">
              No recipes found for your{" "}
              {searchByName
                ? searchByName
                : searchByCategory
                ? searchByCategory
                : searchByArea
                ? searchByArea
                : "search"}
              .
            </p>
          )}
        </div>
      )}

      {showBackToTop && (
        <button onClick={scrollToTop} className="back-to-top-btn">
          Back to Top
        </button>
      )}
    </div>
  );
}

export default HomePage;
