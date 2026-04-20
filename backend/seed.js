const mongoose = require('mongoose');
require('dotenv').config();

const Book = require('./models/Book');
const User = require('./models/User');
const Category = require('./models/Category');
const Transaction = require('./models/Transaction');

const categories = [
  { name: 'Computer Science', description: 'Programming and Computer Engineering' },
  { name: 'Mathematics', description: 'Mathematical Sciences' },
  { name: 'Physics', description: 'Physics and Applied Physics' },
  { name: 'Chemistry', description: 'Chemical Sciences' },
  { name: 'Management', description: 'Business Management' },
  { name: 'Literature', description: 'English Literature' },
  { name: 'Engineering', description: 'Various Engineering Streams' },
  { name: 'Commerce', description: 'Commerce and Accounts' }
];

const books = [
  { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', category: 'Computer Science', description: 'Comprehensive introduction to algorithms', publisher: 'MIT Press', publishedYear: 2009, totalCopies: 5, price: 2500, imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', 'https://images.unsplash.com/photo-1512820790803-83ca717da043?w=400'] },
  { title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', category: 'Computer Science', description: 'A Handbook of Agile Software Craftsmanship', publisher: 'Prentice Hall', publishedYear: 2008, totalCopies: 8, price: 1800, imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400'] },
  { title: 'Design Patterns', author: 'Gang of Four', isbn: '978-0201633610', category: 'Computer Science', description: 'Elements of Reusable Object-Oriented Software', publisher: 'Addison-Wesley', publishedYear: 1994, totalCopies: 4, price: 2200, imageUrl: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=400', images: ['https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=400', 'https://images.unsplash.com/photo-1491841550270-3bfa040896c5?w=400'] },
  { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: '978-0201616224', category: 'Computer Science', description: 'Your Journey to Mastery', publisher: 'Addison-Wesley', publishedYear: 1999, totalCopies: 6, price: 2000, imageUrl: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=400', images: ['https://images.unsplash.com/photo-1517705008128-361805f42e86?w=400', 'https://images.unsplash.com/photo-1509021436668-a7e3b4deb6c5?w=400'] },
  { title: 'Database System Concepts', author: 'Abraham Silberschatz', isbn: '978-0078022159', category: 'Computer Science', description: 'Comprehensive database textbook', publisher: 'McGraw Hill', publishedYear: 2010, totalCopies: 5, price: 2800, imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e0?w=400', images: ['https://images.unsplash.com/photo-1543002588-bfa74002ed7e0?w=400', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400'] },
  { title: 'Computer Networks', author: 'Andrew S. Tanenbaum', isbn: '978-0132126953', category: 'Computer Science', description: 'Fifth Edition', publisher: 'Pearson', publishedYear: 2010, totalCopies: 4, price: 2400, imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400', images: ['https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400'] },
  { title: 'Operating System Concepts', author: 'Abraham Silberschatz', isbn: '978-0471694663', category: 'Computer Science', description: 'Ninth Edition', publisher: 'Wiley', publishedYear: 2012, totalCopies: 3, price: 2600, imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400', images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=400', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400'] },
  { title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell', isbn: '978-0136042594', category: 'Computer Science', description: 'Third Edition', publisher: 'Pearson', publishedYear: 2009, totalCopies: 6, price: 3200, imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400', images: ['https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400', 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400'] },
  { title: 'Calculus: Early Transcendentals', author: 'James Stewart', isbn: '978-1285741550', category: 'Mathematics', description: '8th Edition', publisher: 'Cengage Learning', publishedYear: 2015, totalCopies: 10, price: 3500, imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd9ba10bf?w=400', images: ['https://images.unsplash.com/photo-1509228468518-180dd9ba10bf?w=400', 'https://images.unsplash.com/photo-1635070041078-363d31eaaee4?w=400'] },
  { title: 'Advanced Engineering Mathematics', author: 'Erwin Kreyszig', isbn: '978-0470458365', category: 'Mathematics', description: '10th Edition', publisher: 'Wiley', publishedYear: 2011, totalCopies: 8, price: 3000, imageUrl: 'https://images.unsplash.com/photo-1635070041078-363d31eaaee4?w=400', images: ['https://images.unsplash.com/photo-1635070041078-363d31eaaee4?w=400', 'https://images.unsplash.com/photo-1509228468518-180dd9ba10bf?w=400'] },
  { title: 'University Physics', author: 'Young and Freedman', isbn: '978-0321973610', category: 'Physics', description: '14th Edition', publisher: 'Pearson', publishedYear: 2015, totalCopies: 7, price: 3200, imageUrl: 'https://images.unsplash.com/photo-1636466497217-0c37331c5c2e?w=400', images: ['https://images.unsplash.com/photo-1636466497217-0c37331c5c2e?w=400', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400'] },
  { title: 'Fundamentals of Physics', author: 'Halliday Resnick', isbn: '978-1118230718', category: 'Physics', description: '10th Edition', publisher: 'Wiley', publishedYear: 2013, totalCopies: 6, price: 2800, imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400', images: ['https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400', 'https://images.unsplash.com/photo-1636466497217-0c37331c5c2e?w=400'] },
  { title: 'Chemistry: The Central Science', author: 'Theodore Brown', isbn: '978-0134041672', category: 'Chemistry', description: '14th Edition', publisher: 'Pearson', publishedYear: 2017, totalCopies: 5, price: 3400, imageUrl: 'https://images.unsplash.com/photo-1532187863486-944f317c6d805?w=400', images: ['https://images.unsplash.com/photo-1532187863486-944f317c6d805?w=400', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'] },
  { title: 'Principles of Marketing', author: 'Philip Kotler', isbn: '978-0133597240', category: 'Management', description: '15th Edition', publisher: 'Pearson', publishedYear: 2014, totalCopies: 12, price: 2800, imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c34f?w=400', images: ['https://images.unsplash.com/photo-1460925895917-afdab827c34f?w=400', 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=400'] },
  { title: 'Business Management', author: 'Stephen Robbins', isbn: '978-0133507675', category: 'Management', description: '13th Edition', publisher: 'Pearson', publishedYear: 2013, totalCopies: 10, price: 2600, imageUrl: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=400', images: ['https://images.unsplash.com/photo-1553484771-371a605b060b?w=400', 'https://images.unsplash.com/photo-1460925895917-afdab827c34f?w=400'] },
  { title: 'Financial Accounting', author: 'Horngren', isbn: '978-0133051081', category: 'Commerce', description: '5th Edition', publisher: 'Pearson', publishedYear: 2012, totalCopies: 8, price: 2400, imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400', images: ['https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400', 'https://images.unsplash.com/photo-1554224155-8d04c1f5e4a?w=400'] },
  { title: 'Engineering Mechanics', author: 'R.K. Jain', isbn: '978-8122407723', category: 'Engineering', description: 'Statics and Dynamics', publisher: 'Standard Publishers', publishedYear: 2011, totalCopies: 6, price: 1800, imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4e0c1a76f7?w=400', images: ['https://images.unsplash.com/photo-1581092918056-0c4e0c1a76f7?w=400', 'https://images.unsplash.com/photo-1504917595217-67912d421f7f?w=400'] },
  { title: 'Electrical Engineering', author: 'V.K. Mehta', isbn: '978-8120323823', category: 'Engineering', description: 'Principles and Applications', publisher: 'Oxford', publishedYear: 2014, totalCopies: 5, price: 1600, imageUrl: 'https://images.unsplash.com/photo-1563770095-39d468f9575d?w=400', images: ['https://images.unsplash.com/photo-1563770095-39d468f9575d?w=400', 'https://images.unsplash.com/photo-1558618666-fbb25efb17db?w=400'] },
  { title: 'English Literature', author: 'William Blake', isbn: '978-0141439471', category: 'Literature', description: 'Poems and Prose', publisher: 'Penguin', publishedYear: 2000, totalCopies: 4, price: 800, imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', 'https://images.unsplash.com/photo-1512820790803-83ca717da043?w=400'] },
  { title: 'Data Structures in C', author: 'Yashavant Kanetkar', isbn: '978-8183330404', category: 'Computer Science', description: 'Understandable coverage', publisher: 'BPB Publications', publishedYear: 2005, totalCopies: 15, price: 600, imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca717da043?w=400', images: ['https://images.unsplash.com/photo-1512820790803-83ca717da043?w=400', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'] }
];

const users = [
  { name: 'Admin User', email: 'admin@gla.ac.in', password: 'admin123', role: 'admin', phone: '+911234567890' },
  { name: 'Rahul Sharma', email: 'rahul@gla.ac.in', password: 'student123', role: 'student', studentId: 'BCA2021001', department: 'BCA', phone: '+911234567891' },
  { name: 'Priya Patel', email: 'priya@gla.ac.in', password: 'student123', role: 'student', studentId: 'BCA2021002', department: 'BCA', phone: '+911234567892' },
  { name: 'Amit Kumar', email: 'amit@gla.ac.in', password: 'student123', role: 'student', studentId: 'B-Tech2021001', department: 'B.Tech', phone: '+911234567893' },
  { name: 'Sneha Gupta', email: 'sneha@gla.ac.in', password: 'student123', role: 'student', studentId: 'BBA2021001', department: 'BBA', phone: '+911234567894' },
  { name: 'Vikram Singh', email: 'vikram@gla.ac.in', password: 'student123', role: 'student', studentId: 'B-Pharm2021001', department: 'B.Pharm', phone: '+911234567895' },
  { name: 'Anjali Yadav', email: 'anjali@gla.ac.in', password: 'student123', role: 'student', studentId: 'BCA2021003', department: 'BCA', phone: '+911234567896' },
  { name: 'Rohan Gupta', email: 'rohan@gla.ac.in', password: 'student123', role: 'student', studentId: 'B-Tech2021002', department: 'B.Tech', phone: '+911234567897' }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/library');
    console.log('Connected to MongoDB...');

    // Clear existing data
    await Category.deleteMany({});
    await Book.deleteMany({});
    await User.deleteMany({});
    await Transaction.deleteMany({});
    console.log('Cleared existing data...');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories`);

    // Map category names to IDs
    const catMap = {};
    createdCategories.forEach(cat => {
      catMap[cat.name] = cat._id;
    });

    // Create books with category IDs
    const booksWithCat = books.map(book => ({
      ...book,
      category: catMap[book.category],
      availableCopies: book.totalCopies
    }));
    const createdBooks = await Book.insertMany(booksWithCat);
    console.log(`Created ${createdBooks.length} books`);

    // Create users
    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users`);

    // Create some sample transactions
    const students = createdUsers.filter(u => u.role === 'student');
    const transactions = [];

    for (let i = 0; i < Math.min(5, students.length); i++) {
      const randomBooks = createdBooks.sort(() => 0.5 - Math.random()).slice(0, 3);
      for (const book of randomBooks.slice(0, 2)) {
        const issueDate = new Date();
        issueDate.setDate(issueDate.getDate() - Math.floor(Math.random() * 30));
        const dueDate = new Date(issueDate);
        dueDate.setDate(dueDate.getDate() + 14);

        transactions.push({
          book: book._id,
          user: students[i]._id,
          issuedBy: createdUsers[0]._id,
          issueDate,
          dueDate,
          status: Math.random() > 0.5 ? 'issued' : 'returned',
          returnDate: Math.random() > 0.5 ? new Date() : null,
          fine: 0,
          borrowingPeriod: 14
        });
      }
    }

    await Transaction.insertMany(transactions);
    console.log(`Created ${transactions.length} transactions`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Credentials:');
    console.log('Admin: admin@gla.ac.in / admin123');
    console.log('Student: rahul@gla.ac.in / student123');
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();