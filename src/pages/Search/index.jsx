import useSearchStore from '@/store/useSearchStore';
import styles from './search.module.css';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from '@react-vant/icons';
import SvgSearch from '@react-vant/icons/es/Search';
import { debounce } from '@/utils';

const SEARCH_HISTORY_KEY = 'trip_search_history';

const Search = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showSuggestPanel, setShowSuggestPanel] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const {
    hotList,
    setHotList,
    suggestList,
    setSuggestList
  } = useSearchStore();

  const handleSuggestDebounce = useMemo(() => {
    return debounce((keyword) => {
      if (!keyword) return;
      setSuggestList(keyword);
    }, 300);
  }, [setSuggestList]);

  useEffect(() => {
    setHotList();
    const cache = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (cache) {
      try {
        const parsed = JSON.parse(cache);
        if (Array.isArray(parsed)) {
          setSearchHistory(parsed);
        }
      } catch (error) {
        localStorage.removeItem(SEARCH_HISTORY_KEY);
      }
    }
  }, [])

  useEffect(() => {
    const keyword = query.trim();
    if (!keyword) {
      setShowSuggestPanel(false);
      return;
    }
    setShowSuggestPanel(true);
    handleSuggestDebounce(keyword);
  }, [query, handleSuggestDebounce]);

  const keyword = query.trim();
  const showSearchBtn = query.trim().length > 0;

  const saveSearchHistory = (value) => {
    const nextKeyword = value.trim();
    if (!nextKeyword) return; 
    
    setSearchHistory((prev) => {
      const nextList = [
        nextKeyword,
        ...prev.filter((item) => item !== nextKeyword)
      ].slice(0, 10);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(nextList));
      return nextList;
    });
  };

  const removeHistoryItem = (target) => {
    setSearchHistory((prev) => {
      const nextList = prev.filter((item) => item !== target);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(nextList));
      return nextList;
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.searchBar}>
          <ArrowLeft onClick={() => navigate(-1)} />
          <div className={styles.searchWrap}>
            <SvgSearch className={styles.searchIcon} />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={styles.searchInput}
              placeholder="搜索旅游相关"
            />
            {showSearchBtn ? (
              <button
                type="button"
                className={styles.searchBtn}
                onClick={() => {
                  const nextKeyword = query.trim();
                  setSuggestList(nextKeyword);
                  saveSearchHistory(nextKeyword);
                  setShowSuggestPanel(false);
                }}
              >
                搜索
              </button>
            ) : null}
          </div>
        </div>
        <div className={styles.history}>
          {searchHistory.length > 0 ? (
            <>
              <h1>搜索历史</h1>
              {searchHistory.map((item) => (
                <div key={item} className={styles.historyItem}>
                  <span>{item}</span>
                  <button
                    type="button"
                    className={styles.historyDelete}
                    onClick={() => removeHistoryItem(item)}
                    aria-label={`删除${item}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </>
          ) : (
            <div className={styles.historyPlaceholder} />
          )}
        </div>

        <div className={styles.hot}>
          <h1>热门推荐</h1>
          {hotList.map((item) => (
            <div key={item.id} className={styles.item}>
              {item.city}
            </div>
          ))}
        </div>
        {showSuggestPanel ? (
          <div className={styles.list}>
            {suggestList.length > 0 ? (
              suggestList.map((item) => (
                <div
                  key={item}
                  className={styles.suggestItem}
                  onClick={() => saveSearchHistory(item)}
                >
                  {item}
                </div>
              ))
            ) : (
              <div className={styles.emptyTip}>未匹配到联想词</div>
            )}
          </div>
        ) : null}
      </div>

    </div>
  )
}

export default Search