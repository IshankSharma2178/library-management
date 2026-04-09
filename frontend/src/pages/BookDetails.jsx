import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { bookService, requestService, transactionService } from "../services/api";
import { AuthContext } from "../context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  ArrowLeft,
  BookOpen,
  User,
  Calendar,
  MapPin,
  Package,
  DollarSign,
  AArrowDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myRequestStatus, setMyRequestStatus] = useState(null);
  const [alreadyBorrowed, setAlreadyBorrowed] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isAdmin = user?.role === "admin";
  const isStudent = user?.role === "student";

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [bookRes, userRes] = await Promise.all([
        bookService.getById(id),
        isStudent ? transactionService.getByUser(user.id) : Promise.resolve({ data: [] })
      ]);
      
      setBook(bookRes.data);
      
      if (isStudent) {
        const transactions = userRes.data || [];
        const borrowed = transactions.some(
          (t) => t.book?._id === id && t.status === "issued"
        );
        setAlreadyBorrowed(borrowed);
        
        const requests = await requestService.getMyRequests();
        const reqData = requests.data || requests;
        const myRequest = reqData.find(
          (r) => r.book?._id === id && r.status === "pending"
        );
        setMyRequestStatus(myRequest?.status || null);
      }
    } catch (err) {
      console.error("Failed to load book");
      navigate("/books");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestBook = async () => {
    try {
      await requestService.create(id);
      alert("Book request submitted successfully!");
      setMyRequestStatus("pending");
    } catch (err) {
      alert(err.response?.data?.msg || "Request failed");
    }
  };

  const nextImage = () => {
    if (book?.images) {
      setCurrentImageIndex((prev) => 
        prev === book.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (book?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? book.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!book) return <div className="loading">Book not found</div>;

  return (
    <div className="book-details-page">
      <Link to="/books" className="back-link">
        <ArrowLeft size={20} /> Back to Books
      </Link>

      <div className="book-details-grid">
        <Card className="book-images-card">
          <CardContent className="book-images-content">
            {book.images && book.images.length > 0 ? (
              <div className="image-gallery">
                <div className="main-image-container">
                  {book.images.length > 1 && (
                    <button className="gallery-arrow gallery-arrow-left" onClick={prevImage}>
                      <ChevronLeft size={24} />
                    </button>
                  )}
                  <img 
                    src={book.images[currentImageIndex]} 
                    alt={`${book.title} ${currentImageIndex + 1}`} 
                    className="main-image"
                  />
                  {book.images.length > 1 && (
                    <button className="gallery-arrow gallery-arrow-right" onClick={nextImage}>
                      <ChevronRight size={24} />
                    </button>
                  )}
                  <div className="image-counter">
                    {currentImageIndex + 1} / {book.images.length}
                  </div>
                </div>
                {book.images.length > 1 && (
                  <div className="thumbnail-row">
                    {book.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${book.title} ${index + 1}`}
                        className={`thumbnail ${index === currentImageIndex ? 'thumbnail-active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="no-image">
                <BookOpen size={64} />
                <p>No images available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="book-info-card">
          <CardHeader>
            <div className="book-header">
              <Badge variant="success">{book.category}</Badge>
              {book.availableCopies > 0 ? (
                <Badge variant="success">Available</Badge>
              ) : (
                <Badge variant="destructive">Unavailable</Badge>
              )}
            </div>
            <CardTitle className="book-title">{book.title}</CardTitle>
            <p className="book-author">by {book.author}</p>
          </CardHeader>
          <CardContent className="book-details-content">
            <div className="detail-row">
              <DollarSign size={18} className="detail-icon" />
              <span className="detail-label">Price:</span>
              <span className="detail-value">₹{book.price || 0}</span>
            </div>

            <div className="detail-row">
              <AArrowDown size={18} className="detail-icon" />
              <span className="detail-label">ISBN:</span>
              <span className="detail-value">{book.isbn}</span>
            </div>

            <div className="detail-row">
              <Package size={18} className="detail-icon" />
              <span className="detail-label">Availability:</span>
              <span
                className={`detail-value ${book.availableCopies > 0 ? "text-success" : "text-danger"}`}
              >
                {book.availableCopies} / {book.totalCopies} copies
              </span>
            </div>

            {book.publisher && (
              <div className="detail-row">
                <User size={18} className="detail-icon" />
                <span className="detail-label">Publisher:</span>
                <span className="detail-value">{book.publisher}</span>
              </div>
            )}

            {book.publishedYear && (
              <div className="detail-row">
                <Calendar size={18} className="detail-icon" />
                <span className="detail-label">Published:</span>
                <span className="detail-value">{book.publishedYear}</span>
              </div>
            )}

            {book.location && (
              <div className="detail-row">
                <MapPin size={18} className="detail-icon" />
                <span className="detail-label">Location:</span>
                <span className="detail-value">{book.location}</span>
              </div>
            )}

            {book.description && (
              <div className="book-description">
                <h3>Description</h3>
                <p>{book.description}</p>
              </div>
            )}

            <div className="book-actions-section">
              {isStudent && (
                <>
                  {alreadyBorrowed ? (
                    <button className="btn btn-success" disabled>
                      <CheckCircle size={18} /> Already Borrowed
                    </button>
                  ) : myRequestStatus === "pending" ? (
                    <button className="btn btn-secondary" disabled>
                      Request Pending
                    </button>
                  ) : book.availableCopies > 0 ? (
                    <button
                      onClick={handleRequestBook}
                      className="btn btn-primary"
                    >
                      Request Book
                    </button>
                  ) : (
                    <button className="btn btn-secondary" disabled>
                      Not Available
                    </button>
                  )}
                </>
              )}
              {isAdmin && (
                <Link to={`/update-book`} className="btn btn-primary">
                  Edit Book
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookDetails;
