const prisma = require("../prisma/client");

module.exports.category = async function (req, res) {
  try {
    const { name } = req.body;
    const userId = req.user.id;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const existCategory = await prisma.category.findUnique({
      where: { 
        name_userId: {
          name,
          userId,
        }
       },
    });
    if (existCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }
    const category = await prisma.category.create({
      data: { name, userId},
    });
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.allCategory = async function (req, res) {
  try{
    const category = await prisma.category.findMany({
      where: {
        userId: req.user.id
      }
    });
    res.status(200).json(category)
  } catch(error){
    console.error(error);
    res.status(500).json({message: "server category error"});
  }
};

module.exports.createTransaction = async function (req, res) {
  try {
    const { name, type, categoryId, amount, description } = req.body;
    const userId = req.user.id;

    if (!name || !type || !categoryId || !amount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existCategory = await prisma.category.findFirst({
      where: {
        id: Number(categoryId),
        userId: userId,
      },
    });

    if (!existCategory) {
      return res.status(400).json({ message: "Category not found" });
    }

    const transaction = await prisma.transaction.create({
      data: {
        name,
        type,
        amount: Number(amount),
        description,

        user: {
          connect: { id: userId },
        },
        category: {
          connect: { id: existCategory.id },
        },
      },
    });

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports.transactions = async function (req, res) {
  try {

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.user.id,
      },
      
    });

    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server transaction error" });
  }
};


module.exports.gettransaction = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const search = req.query.search?.trim();
    const type = req.query.type || "all";
    const minAmount = Number(req.query.minAmount) || 0;
    const maxAmount = Number(req.query.maxAmount);

    const whereCondition = {
      userId: req.user.id,
    };

    // SEARCH FILTER (MySQL SAFE)
    if (search && search.length >= 2) {
      whereCondition.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        {
          category: {
            name: { contains: search },
          },
        },
        ...(Number(search) ? [{ amount: Number(search) }] : []),
      ];
    }

    // TYPE FILTER
    if (type !== "all") {
      whereCondition.type = type;
    }

    // AMOUNT RANGE
    if (minAmount || maxAmount) {
      whereCondition.amount = {};
      if (minAmount) whereCondition.amount.gte = Number(minAmount);
      if (maxAmount) whereCondition.amount.lte = Number(maxAmount);
    }

    const transactions = await prisma.transaction.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });

    const total = await prisma.transaction.count({
      where: whereCondition,
    });

    res.status(200).json({
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.updateTransaction = async (req, res) => {
  try{
    const {id} = req.params;
    const { name, amount, type, categoryId, description} = req.body;

    const updated = await prisma.transaction.update({
      where: { id: Number(id) },
      data: {
        name,
        type,
        categoryId: Number(categoryId),
        amount: Number(amount),                                                       
        description,
      },
    });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ message: "Error update transaction"})
  }
}

exports.getTransactionById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: req.user.id,
      },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.transaction.delete({
      where: { id: Number(id) },
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};
