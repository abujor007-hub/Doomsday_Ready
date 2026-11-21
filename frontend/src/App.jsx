
import { useEffect, useState } from 'react'
import API from './api'

function App() {
    const [activePage, setActivePage] = useState('Movies')

    // Movie states
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Rewatch Plan states
    const [selectedMovie, setSelectedMovie] = useState('')
    const [rewatchData, setRewatchData] = useState(null)
    const [rewatchLoading, setRewatchLoading] = useState(false)
    const [rewatchError, setRewatchError] = useState('')

    // Cinema Booking states
    const [cinemas, setCinemas] = useState([])
    const [cinemasLoading, setCinemasLoading] = useState(false)
    const [cinemasError, setCinemasError] = useState('')

    const [selectedCinema, setSelectedCinema] = useState('')
    const [groupSize, setGroupSize] = useState(6)

    const [bookingData, setBookingData] = useState(null)
    const [bookingLoading, setBookingLoading] = useState(false)
    const [bookingError, setBookingError] = useState('')

    // Fetch all movies
    const fetchMovies = async () => {
        try {
            setLoading(true)
            setError('')

            const response = await API.get('/movies')

            setMovies(response.data.data || [])
        } catch (err) {
            console.log(err)
            setError('Movies load korte problem hocche.')
        } finally {
            setLoading(false)
        }
    }

    // Fetch movies when page loads
    useEffect(() => {
        fetchMovies()
    }, [])

    // Generate Rewatch Plan
    const fetchRewatchPlan = async () => {
        if (!selectedMovie) {
            setRewatchError('Please select a movie first.')
            return
        }

        try {
            setRewatchLoading(true)
            setRewatchError('')
            setRewatchData(null)

            const response = await API.get(
                `/movies/${selectedMovie}/rewatch-order`
            )

            setRewatchData(response.data)
        } catch (err) {
            console.log(err)
            setRewatchError(
                err.response?.data?.message || 'Rewatch plan load failed.'
            )
        } finally {
            setRewatchLoading(false)
        }
    }

    // Fetch all cinemas
    const fetchCinemas = async () => {
        try {
            setCinemasLoading(true)
            setCinemasError('')

            const response = await API.get('/cinemas')

            const cinemaList = response.data.data || []

            setCinemas(cinemaList)

            if (cinemaList.length > 0) {
                setSelectedCinema(String(cinemaList[0].id))
            }
        } catch (err) {
            console.log(err)
            setCinemasError('Cinema list load korte problem hocche.')
        } finally {
            setCinemasLoading(false)
        }
    }

    // Load cinemas when Booking page opens
    useEffect(() => {
        if (activePage === 'Booking') {
            fetchCinemas()
        }
    }, [activePage])

    // Calculate Cinema Booking
    const calculateBooking = async () => {
        if (!selectedCinema) {
            setBookingError('Please select a cinema.')
            return
        }

        const size = Number(groupSize)

        if (!Number.isInteger(size) || size < 1 || size > 10000) {
            setBookingError('Group size must be between 1 and 10000.')
            return
        }

        try {
            setBookingLoading(true)
            setBookingError('')
            setBookingData(null)

            const response = await API.get(
                `/cinemas/${selectedCinema}/booking`,
                {
                    params: {
                        groupSize: size,
                    },
                }
            )

            setBookingData(response.data)
        } catch (err) {
            console.log(err)
            setBookingError(
                err.response?.data?.message || 'Booking calculation failed.'
            )
        } finally {
            setBookingLoading(false)
        }
    }

    return (
        <div className="min-vh-100 bg-light">

            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
                <div className="container">

                    <a
                        className="navbar-brand fw-bold"
                        href="#home"
                        onClick={(e) => {
                            e.preventDefault()
                            setActivePage('Movies')
                        }}
                    >
                        <i className="bi bi-film me-2 text-warning"></i>
                        Doomsday Ready
                    </a>

                    <div className="d-flex flex-wrap gap-2">

                        <button
                            className={`btn btn-sm ${
                                activePage === 'Movies'
                                    ? 'btn-warning'
                                    : 'btn-outline-light'
                            }`}
                            onClick={() => setActivePage('Movies')}
                        >
                            <i className="bi bi-camera-reels me-1"></i>
                            Movies
                        </button>

                        <button
                            className={`btn btn-sm ${
                                activePage === 'Rewatch'
                                    ? 'btn-warning'
                                    : 'btn-outline-light'
                            }`}
                            onClick={() => setActivePage('Rewatch')}
                        >
                            <i className="bi bi-list-check me-1"></i>
                            Rewatch Plan
                        </button>

                        <button
                            className={`btn btn-sm ${
                                activePage === 'Booking'
                                    ? 'btn-warning'
                                    : 'btn-outline-light'
                            }`}
                            onClick={() => setActivePage('Booking')}
                        >
                            <i className="bi bi-ticket-perforated me-1"></i>
                            Booking
                        </button>

                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container py-5">

                {/* Movies Page */}
                {activePage === 'Movies' && (
                    <>
                        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">

                            <div>
                                <h2 className="fw-bold mb-1">
                                    Marvel Movies
                                </h2>

                                <p className="text-muted mb-0">
                                    All movies from the Doomsday Ready API.
                                </p>
                            </div>

                            <button
                                className="btn btn-dark"
                                onClick={fetchMovies}
                            >
                                <i className="bi bi-arrow-clockwise me-2"></i>
                                Refresh
                            </button>

                        </div>

                        {loading && (
                            <div className="text-center py-5">
                                <div className="spinner-border text-dark"></div>
                                <p className="mt-2">Loading movies...</p>
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        )}

                        {!loading && !error && (
                            <div className="card border-0 shadow-sm">

                                <div className="card-header bg-white py-3">
                                    <h5 className="fw-bold mb-0">
                                        Movie List ({movies.length})
                                    </h5>
                                </div>

                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">

                                        <thead className="table-dark">
                                            <tr>
                                                <th>#</th>
                                                <th>Movie Title</th>
                                                <th>Release Year</th>
                                                <th>Runtime</th>
                                                <th>Watched</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {movies.length > 0 ? (
                                                movies.map((movie, index) => (
                                                    <tr key={movie.id}>
                                                        <td>{index + 1}</td>

                                                        <td className="fw-semibold">
                                                            {movie.title}
                                                        </td>

                                                        <td>
                                                            {movie.release_year}
                                                        </td>

                                                        <td>
                                                            {movie.runtime} min
                                                        </td>

                                                        <td>
                                                            {movie.watched ? (
                                                                <span className="badge bg-success">
                                                                    Watched
                                                                </span>
                                                            ) : (
                                                                <span className="badge bg-secondary">
                                                                    Not Watched
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="5"
                                                        className="text-center py-4"
                                                    >
                                                        No movies found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>

                                    </table>
                                </div>

                            </div>
                        )}
                    </>
                )}

                {/* Rewatch Plan Page */}
                {activePage === 'Rewatch' && (
                    <>
                        <div className="mb-4">
                            <h2 className="fw-bold">
                                Rewatch Plan
                            </h2>

                            <p className="text-muted">
                                Generate the correct movie watching order.
                            </p>
                        </div>

                        <div className="card border-0 shadow-sm p-4 mb-4">

                            <label className="form-label fw-semibold">
                                Select Target Movie
                            </label>

                            <select
                                className="form-select mb-3"
                                value={selectedMovie}
                                onChange={(e) => {
                                    setSelectedMovie(e.target.value)
                                    setRewatchData(null)
                                    setRewatchError('')
                                }}
                            >
                                <option value="">
                                    Select a movie
                                </option>

                                {movies.map((movie) => (
                                    <option
                                        key={movie.id}
                                        value={movie.id}
                                    >
                                        {movie.title}
                                    </option>
                                ))}
                            </select>

                            <button
                                className="btn btn-dark"
                                onClick={fetchRewatchPlan}
                                disabled={rewatchLoading}
                            >
                                {rewatchLoading ? (
                                    'Generating...'
                                ) : (
                                    <>
                                        <i className="bi bi-play-fill me-2"></i>
                                        Generate Rewatch Plan
                                    </>
                                )}
                            </button>

                        </div>

                        {rewatchError && (
                            <div className="alert alert-danger">
                                {rewatchError}
                            </div>
                        )}

                        {rewatchData && (
                            <>
                                <h5 className="fw-bold mb-3">
                                    Target: {rewatchData.target_movie?.title}
                                </h5>

                                <div className="row g-3 mb-4">

                                    <div className="col-md-3">
                                        <div className="card border-0 shadow-sm p-3">
                                            <p className="text-muted mb-1">
                                                Total Movies
                                            </p>
                                            <h3 className="fw-bold">
                                                {rewatchData.total_movies}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <div className="card border-0 shadow-sm p-3">
                                            <p className="text-muted mb-1">
                                                Watched
                                            </p>
                                            <h3 className="fw-bold text-success">
                                                {rewatchData.watched_count}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <div className="card border-0 shadow-sm p-3">
                                            <p className="text-muted mb-1">
                                                Unwatched
                                            </p>
                                            <h3 className="fw-bold text-warning">
                                                {rewatchData.unwatched_count}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <div className="card border-0 shadow-sm p-3">
                                            <p className="text-muted mb-1">
                                                Remaining Runtime
                                            </p>
                                            <h3 className="fw-bold">
                                                {rewatchData.remaining_runtime} min
                                            </h3>
                                        </div>
                                    </div>

                                </div>

                                <div className="card border-0 shadow-sm">

                                    <div className="card-header bg-white py-3">
                                        <h5 className="fw-bold mb-0">
                                            Recommended Watching Order
                                        </h5>
                                    </div>

                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">

                                            <thead className="table-dark">
                                                <tr>
                                                    <th>Order</th>
                                                    <th>Movie</th>
                                                    <th>Year</th>
                                                    <th>Runtime</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {rewatchData.data?.length > 0 ? (
                                                    rewatchData.data.map((movie, index) => (
                                                        <tr key={movie.id}>
                                                            <td>
                                                                {index + 1}
                                                            </td>

                                                            <td className="fw-semibold">
                                                                {movie.title}
                                                            </td>

                                                            <td>
                                                                {movie.release_year}
                                                            </td>

                                                            <td>
                                                                {movie.runtime} min
                                                            </td>

                                                            <td>
                                                                {movie.watched ? (
                                                                    <span className="badge bg-success">
                                                                        Watched
                                                                    </span>
                                                                ) : (
                                                                    <span className="badge bg-warning text-dark">
                                                                        Not Watched
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan="5"
                                                            className="text-center py-4"
                                                        >
                                                            No prerequisite movies found.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>

                                        </table>
                                    </div>

                                </div>
                            </>
                        )}
                    </>
                )}

                {/* Cinema Booking Page */}
                {activePage === 'Booking' && (
                    <>
                        <div className="mb-4">
                            <h2 className="fw-bold">
                                Cinema Booking
                            </h2>

                            <p className="text-muted">
                                Calculate the minimum number of ticket bundles
                                required for your group.
                            </p>
                        </div>

                        <div className="card border-0 shadow-sm p-4 mb-4">

                            <h5 className="fw-bold mb-4">
                                <i className="bi bi-ticket-perforated me-2"></i>
                                Calculate Ticket Bundles
                            </h5>

                            {cinemasLoading && (
                                <p>Loading cinemas...</p>
                            )}

                            {cinemasError && (
                                <div className="alert alert-danger">
                                    {cinemasError}
                                </div>
                            )}

                            {!cinemasLoading && !cinemasError && (
                                <>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            Select Cinema
                                        </label>

                                        <select
                                            className="form-select"
                                            value={selectedCinema}
                                            onChange={(e) => {
                                                setSelectedCinema(e.target.value)
                                                setBookingData(null)
                                                setBookingError('')
                                            }}
                                        >
                                            <option value="">
                                                Select a cinema
                                            </option>

                                            {cinemas.map((cinema) => (
                                                <option
                                                    key={cinema.id}
                                                    value={cinema.id}
                                                >
                                                    {cinema.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            Group Size
                                        </label>

                                        <input
                                            type="number"
                                            className="form-control"
                                            min="1"
                                            max="10000"
                                            value={groupSize}
                                            onChange={(e) => {
                                                setGroupSize(e.target.value)
                                                setBookingData(null)
                                                setBookingError('')
                                            }}
                                            placeholder="Enter group size"
                                        />

                                        <small className="text-muted">
                                            Minimum 1 and maximum 10000 people.
                                        </small>
                                    </div>

                                    <button
                                        className="btn btn-dark"
                                        onClick={calculateBooking}
                                        disabled={
                                            bookingLoading ||
                                            cinemas.length === 0
                                        }
                                    >
                                        {bookingLoading ? (
                                            'Calculating...'
                                        ) : (
                                            <>
                                                <i className="bi bi-calculator me-2"></i>
                                                Calculate Bundles
                                            </>
                                        )}
                                    </button>
                                </>
                            )}

                        </div>

                        {bookingError && (
                            <div className="alert alert-danger">
                                {bookingError}
                            </div>
                        )}

                        {bookingData && (
                            <div className="card border-0 shadow-sm p-4">

                                <h5 className="fw-bold mb-3">
                                    Booking Calculation Result
                                </h5>

                                <p className="mb-2">
                                    <strong>Cinema:</strong>{' '}
                                    {bookingData.cinema}
                                </p>

                                <p className="mb-3">
                                    <strong>Group Size:</strong>{' '}
                                    {bookingData.group_size}
                                </p>

                                {bookingData.possible ? (
                                    <>
                                        <div className="alert alert-success">
                                            <h5 className="fw-bold">
                                                Exact bundle combination found!
                                            </h5>

                                            Minimum Bundles:{' '}
                                            <strong>
                                                {bookingData.minimum_bundles}
                                            </strong>
                                        </div>

                                        <h6 className="fw-bold mb-3">
                                            Bundle Details
                                        </h6>

                                        <div className="table-responsive">
                                            <table className="table table-bordered align-middle">

                                                <thead className="table-dark">
                                                    <tr>
                                                        <th>Bundle Size</th>
                                                        <th>Number of Bundles</th>
                                                        <th>Total Seats</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {bookingData.bundle_counts?.map(
                                                        (bundle, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    {bundle.bundle_size}
                                                                </td>

                                                                <td>
                                                                    {bundle.count}
                                                                </td>

                                                                <td>
                                                                    {bundle.bundle_size * bundle.count}
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>

                                            </table>
                                        </div>
                                    </>
                                ) : (
                                    <div className="alert alert-warning mb-0">
                                        <h5 className="fw-bold">
                                            No Exact Combination Available
                                        </h5>

                                        This cinema cannot provide an exact
                                        bundle combination for this group size.
                                    </div>
                                )}

                            </div>
                        )}

                        {!cinemasLoading && !cinemasError && cinemas.length === 0 && (
                            <div className="alert alert-warning">
                                No cinemas found. Please add a cinema first.
                            </div>
                        )}
                    </>
                )}

            </div>

            {/* Footer */}
            <footer className="bg-dark text-white text-center py-3 mt-5">
                <p className="mb-0">
                    Doomsday Ready | Laravel + React
                </p>
            </footer>

        </div>
    )
}

export default App
