import React, { useState, useRef } from 'react';
import { moviesData } from "../../data/movieData";
import { IFilm } from "../../common/types";
import './HomePage.css';

type FilterType = 'all' | 'favorites';
type ViewMode = 'grid' | 'list';

const HomePage: React.FC = () => {
    const [movies, setMovies] = useState<IFilm[]>(moviesData);
    const [filter, setFilter] = useState<FilterType>('all');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const searchRef = useRef<HTMLInputElement>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Переключение избранного
    const toggleFavorite = (movieId: number) => {
        setMovies(prevMovies => 
            prevMovies.map(movie => 
                movie.id === movieId 
                    ? { ...movie, isFavorite: !movie.isFavorite }
                    : movie
            )
        );
    };

    // Обработка поиска
    const handleSearch = () => {
        const value = searchRef.current?.value || '';
        setSearchTerm(value.toLowerCase());
    };

    // Фильтрация фильмов
    const filteredMovies = movies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm);
        const matchesFilter = filter === 'all' || movie.isFavorite;
        return matchesSearch && matchesFilter;
    });

    // Подсчет избранных фильмов
    const favoriteCount = movies.filter(movie => movie.isFavorite).length;
    
    // Состояние для диалога добавления фильма
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newMovie, setNewMovie] = useState({
        title: '',
        year: new Date().getFullYear(),
        posterUrl: '',
        isFavorite: false
    });
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    // Обработчики для диалога
    const handleAdd = () => {
        setIsDialogOpen(true);
        setNewMovie({
            title: '',
            year: new Date().getFullYear(),
            posterUrl: '',
            isFavorite: false
        });
        setErrors({});
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setNewMovie({
            title: '',
            year: new Date().getFullYear(),
            posterUrl: '',
            isFavorite: false
        });
        setErrors({});
    };

    const handleInputChange = (field: string, value: string | number | boolean) => {
        setNewMovie(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Очищаем ошибку при изменении поля
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};

        if (!newMovie.title.trim()) {
            newErrors.title = 'Название фильма обязательно';
        }

        if (!newMovie.posterUrl.trim()) {
            newErrors.posterUrl = 'URL постера обязателен';
        } else if (!isValidUrl(newMovie.posterUrl)) {
            newErrors.posterUrl = 'Введите корректный URL';
        }

        if (newMovie.year < 1900 || newMovie.year > 2030) {
            newErrors.year = 'Год должен быть между 1900 и 2030';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        // Создаем новый фильм
        const movieToAdd: IFilm = {
            id: Math.max(...movies.map(m => m.id)) + 1, // Генерируем уникальный ID
            title: newMovie.title.trim(),
            year: newMovie.year,
            posterUrl: newMovie.posterUrl.trim(),
            isFavorite: newMovie.isFavorite
        };

        // Добавляем фильм в список
        setMovies(prevMovies => [...prevMovies, movieToAdd]);
        
        // Закрываем диалог
        handleCloseDialog();
    };

    return (
        <div className="home-page">
            <header className="page-header">
                <h1>🎬 Мои фильмы</h1>
                
                {/* Поиск */}
                <div className="search-container">
                    <input
                        ref={searchRef}
                        type="text"
                        placeholder="Поиск по названию..."
                        onChange={handleSearch}
                        className="search-input"
                    />
                </div>

                {/* Фильтры */}
                <div className="filter-container">
                    <button 
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        Все ({movies.length})
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'favorites' ? 'active' : ''}`}
                        onClick={() => setFilter('favorites')}
                    >
                        Избранные ({favoriteCount})
                    </button>
                </div>

                {/* Переключатель режима отображения */}
                <div className="view-toggle">
                    <button 
                        className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                        title="Плитка"
                    >
                        ⊞
                    </button>
                    <button 
                        className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                        title="Список"
                    >
                        ☰
                    </button>
                </div>
            </header>

            {/* Список фильмов */}
            <main className={`movies-container ${viewMode}`}>
                {filteredMovies.length === 0 ? (
                    <div className="no-movies">
                        <p>Фильмов нет</p>
                        <p className="no-movies-subtitle">
                            {searchTerm ? 'Попробуйте изменить поисковый запрос' : 'Добавьте фильмы в избранное'}
                        </p>
                    </div>
                ) : (
                    filteredMovies.map(movie => (
                        <div key={movie.id} className={`movie-card ${viewMode}`}>
                            <div className="poster-container">
                                <img 
                                    src={movie.posterUrl} 
                                    alt={movie.title}
                                    className="movie-poster"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        target.nextElementSibling?.classList.add('show-placeholder');
                                    }}
                                />
                                <div className="poster-placeholder">
                                    <span>m</span>
                                    <p>{movie.title}</p>
                                </div>
                                <button 
                                    className={`favorite-btn ${movie.isFavorite ? 'favorited' : ''}`}
                                    onClick={() => toggleFavorite(movie.id)}
                                    title={movie.isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
                                >
                                    {movie.isFavorite ? '⭐' : '☆'}
                                </button>
                            </div>
                            <div className="movie-info">
                                <h3 className="movie-title">{movie.title}</h3>
                                <p className="movie-year">{movie.year}</p>
                            </div>
                        </div>
                    ))
                )}
            </main>

            {/* Кнопка добавления фильма */}
            <button 
                className="add-movie-btn"
                title="Добавить фильм"
                onClick={handleAdd}
            >
                +
            </button>

            {/* Диалоговое окно добавления фильма */}
            {isDialogOpen && (
                <div className="dialog-overlay" onClick={handleCloseDialog}>
                    <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                        <div className="dialog-header">
                            <h2 className="dialog-title">Добавить новый фильм</h2>
                            <button 
                                className="dialog-close-btn" 
                                title="Закрыть"
                                onClick={handleCloseDialog}
                            >
                                ×
                            </button>
                        </div>
                        
                        <form className="add-movie-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Название фильма</label>
                                <input 
                                    type="text" 
                                    className={`form-input ${errors.title ? 'error' : ''}`}
                                    placeholder="Введите название фильма"
                                    value={newMovie.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                />
                                {errors.title && <div className="form-error">{errors.title}</div>}
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Год выпуска</label>
                                <input 
                                    type="number" 
                                    className={`form-input ${errors.year ? 'error' : ''}`}
                                    placeholder="2024"
                                    min="1900"
                                    max="2030"
                                    value={newMovie.year}
                                    onChange={(e) => handleInputChange('year', parseInt(e.target.value) || new Date().getFullYear())}
                                />
                                {errors.year && <div className="form-error">{errors.year}</div>}
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">URL постера</label>
                                <input 
                                    type="url" 
                                    className={`form-input ${errors.posterUrl ? 'error' : ''}`}
                                    placeholder="https://example.com/poster.jpg"
                                    value={newMovie.posterUrl}
                                    onChange={(e) => handleInputChange('posterUrl', e.target.value)}
                                />
                                {errors.posterUrl && <div className="form-error">{errors.posterUrl}</div>}
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Добавить в избранное</label>
                                <select 
                                    className="form-input form-select"
                                    value={newMovie.isFavorite.toString()}
                                    onChange={(e) => handleInputChange('isFavorite', e.target.value === 'true')}
                                >
                                    <option value="false">Нет</option>
                                    <option value="true">Да</option>
                                </select>
                            </div>
                            
                            <div className="form-buttons">
                                <button 
                                    type="button" 
                                    className="form-btn form-btn-cancel"
                                    onClick={handleCloseDialog}
                                >
                                    Отмена
                                </button>
                                <button 
                                    type="submit" 
                                    className="form-btn form-btn-submit"
                                >
                                    Добавить фильм
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;