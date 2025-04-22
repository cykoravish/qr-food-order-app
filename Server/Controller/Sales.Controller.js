import Sales from "../Model/Sales.model.js"

export const getAllSales = async (req, res) => {
    try {
        const salesData = await Sales.find();
        if (!salesData) {
            return res.status(500).json({ message: 'Saled record is null' })
        }
        res.status(200).json({ content: salesData });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server error' })
    }
}