import React, { useState, useReducer, useEffect } from "react";
import "../App.css";
import Header from "../components/Header";
import Movie from "../components/Movie";
import Search from "../components/Search";

//http://www.omdbapi.com/
const MOVIE_API_URL = "https://www.omdbapi.com/?s=matrix&apikey=2c90c812"; // you should replace this with yours

const initialState = {
  loading: true,
  movies: [],
  errorMessage: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_MOVIES_REQUEST":
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
    case "SEARCH_MOVIES_SUCCESS":
      return {
        ...state,
        loading: false,
        movies: action.payload
      };
    case "SEARCH_MOVIES_FAILURE":
      return {
        ...state,
        loading: false,
        errorMessage: action.error
      };
    default:
      return state;
  }
};

export const MoviesPage = () => {
  //const [loading, setLoading] = useState(true);
  //const [movies, setMovies] = useState([]);
  //const [errorMessage, setErrorMessage] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
      fetch(MOVIE_API_URL)
        .then(response => response.json())
        .then(jsonResponse => {
          //setMovies(jsonResponse.Search);
          //setLoading(false);

          dispatch({
            type: "SEARCH_MOVIES_SUCCESS",
            payload: jsonResponse.Search
          });
        });
    }, []);

    const search = searchValue => {
      //setLoading(true);
      //setErrorMessage(null);
      dispatch({
      	type: "SEARCH_MOVIES_REQUEST"
    	});

      fetch(`https://www.omdbapi.com/?s=${searchValue}&apikey=2c90c812`)
        .then(response => response.json())
        .then(jsonResponse => {
          if (jsonResponse.Response === "True") {
            //setMovies(jsonResponse.Search);
            //setLoading(false);
            dispatch({
              type: "SEARCH_MOVIES_SUCCESS",
              payload: jsonResponse.Search
            });
          } else {
            //setErrorMessage(jsonResponse.Error);
            //setLoading(false);
            dispatch({
              type: "SEARCH_MOVIES_FAILURE",
              error: jsonResponse.Error
            });
          }
        });
      
  	};

    const { movies, errorMessage, loading } = state;
    
    return (
      <div className="App">
        <Header text="OMDb API" />
        <Search search={search} />
        <p className="App-intro">Sharing a few of our favourite movies</p>
        <div className="movies">
          {loading && !errorMessage ? (
          <span>loading...</span>
          ) : errorMessage ? (
            <div className="errorMessage">{errorMessage}</div>
          ) : (
            movies.map((movie, index) => (
              <Movie key={`${index}-${movie.Title}`} movie={movie} />
            ))
          )}
        </div>
      </div>
    );
};

export default MoviesPage;