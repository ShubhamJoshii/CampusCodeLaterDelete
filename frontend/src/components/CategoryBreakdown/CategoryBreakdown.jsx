import React from 'react'
import "./CategoryBreakdown.css"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const CategoryBreakdown = ({ data }) => {
    return (
        <div className='categoryBreakdown'>
            <h3 className="cb-title">Category Breakdown</h3>
            <div className="cb-chart-container">
                {Array.isArray(data) && data.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={data}
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={8}
                                dataKey="value"
                                stroke="none"
                                // label={({ name, value }) => `${name.toUpperCase()}: ${value}`}
                            // label
                            >
                                {data.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="cb-empty-state">
                        <div className="cb-empty-circle" />
                        <span className="cb-empty-text">No category data yet</span>
                    </div>
                )}
            </div>

        </div>
    )
}

export default CategoryBreakdown