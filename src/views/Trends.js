import React, { useState, useEffect } from 'react';
import BannerAd from '../components/BannerAd';
import NavBar from '../components/NavBar';

const Trends = () => {
    const [categories, setCategories] = useState([]); // List of activity categories
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        // Fetch activity categories. This is a placeholder.
        // setCategories(fetchCategories());
    }, []);

    const handleCategorySelection = (category) => {
        const newSelection = [...selectedCategories, category];
        if (newSelection.length <= 2) {
            setSelectedCategories(newSelection);
            // Fetch chart data based on the selected categories. This is a placeholder.
            // setChartData(fetchChartData(newSelection));
        }
    };

    return (
        <div className="trends-container">
            <BannerAd />
            <h2>Trends</h2>

            <div className="category-selection">
                {categories.map((category, index) => (
                    <button key={index} onClick={() => handleCategorySelection(category)}>
                        {category.name}
                    </button>
                ))}
            </div>

            <div className="chart">
                {/* Render your chart based on chartData. You might want to use a library like Chart.js or similar */}
            </div>

            <NavBar selected="trends" />
        </div>
    );
}

export default Trends;