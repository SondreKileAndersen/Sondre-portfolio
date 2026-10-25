import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { YouTubePlaylistSection } from '../../types/page'

type YouTubePlayer = {
  destroy: () => void
  getIframe: () => HTMLIFrameElement
  loadVideoById: (videoId: string) => void
}

type YouTubePlayerEvent = {
  target: YouTubePlayer
}

type YouTubeApi = {
  Player: new (
    elementId: string,
    options: {
      videoId: string
      playerVars: Record<string, string | number>
      events: { onReady: (event: YouTubePlayerEvent) => void }
    },
  ) => YouTubePlayer
}

declare global {
  interface Window {
    YT?: YouTubeApi
    onYouTubeIframeAPIReady?: () => void
  }
}

let youtubeApiPromise: Promise<YouTubeApi> | undefined

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT)

  if (!youtubeApiPromise) {
    youtubeApiPromise = new Promise((resolve) => {
      const previousCallback = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        previousCallback?.()
        if (window.YT) resolve(window.YT)
      }

      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const script = document.createElement('script')
        script.src = 'https://www.youtube.com/iframe_api'
        document.head.append(script)
      }
    })
  }

  return youtubeApiPromise
}

export function YouTubePlaylistBlock({
  eyebrow,
  heading,
  introduction,
  playlistId,
  playlistUrl,
  iframeTitle,
  firstVideoId,
  videoLabel,
  categoryLabel,
  thumbnailAltPrefix,
  openPlaylistLabel,
  videos,
}: YouTubePlaylistSection) {
  const reactId = useId()
  const playerId = `youtube-playlist-${reactId.replace(/:/g, '')}`
  const playerRef = useRef<YouTubePlayer | null>(null)
  const pendingVideoIdRef = useRef<string | null>(null)
  const featuredRef = useRef<HTMLDivElement | null>(null)
  const [selectedVideoId, setSelectedVideoId] = useState(firstVideoId)
  const [featuredHeight, setFeaturedHeight] = useState<number>()

  useEffect(() => {
    const featured = featuredRef.current
    if (!featured) return

    const updateHeight = () => setFeaturedHeight(featured.getBoundingClientRect().height)
    const observer = new ResizeObserver(updateHeight)
    observer.observe(featured)
    updateHeight()

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let player: YouTubePlayer | undefined
    let cancelled = false

    void loadYouTubeApi().then((YT) => {
      if (cancelled) return

      player = new YT.Player(playerId, {
        videoId: firstVideoId,
        playerVars: {
          listType: 'playlist',
          list: playlistId,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            playerRef.current = event.target
            event.target.getIframe().title = iframeTitle
            if (pendingVideoIdRef.current) {
              event.target.loadVideoById(pendingVideoIdRef.current)
              pendingVideoIdRef.current = null
            }
          },
        },
      })
    })

    return () => {
      cancelled = true
      playerRef.current = null
      player?.destroy()
    }
  }, [firstVideoId, iframeTitle, playerId, playlistId])

  return (
    <section className="youtube-playlist">
      <header className="youtube-playlist__header">
        {eyebrow && <p className="youtube-playlist__eyebrow">{eyebrow}</p>}
        <h2>{heading}</h2>
        <p>{introduction}</p>
      </header>
      <div className="youtube-playlist__layout">
        <div ref={featuredRef} className="youtube-playlist__featured">
          <div className="youtube-playlist__player">
            <div id={playerId} />
          </div>
        </div>
        <aside
          className="youtube-playlist__queue"
          style={{ '--youtube-featured-height': featuredHeight ? `${featuredHeight}px` : undefined } as CSSProperties}
        >
          <header>
            <a
              className="youtube-playlist__link"
              href={playlistUrl}
              target="_blank"
              rel="noreferrer"
            >
              {openPlaylistLabel} <span aria-hidden="true">↗</span>
            </a>
          </header>
          <div className="youtube-playlist__videos">
            {videos.map((video, index) => (
              <button
                key={video.id}
                className={`youtube-playlist__video${video.videoId === selectedVideoId ? ' youtube-playlist__video--featured' : ''}`}
                type="button"
                aria-pressed={video.videoId === selectedVideoId}
                onClick={() => {
                  setSelectedVideoId(video.videoId)
                  if (playerRef.current) {
                    playerRef.current.loadVideoById(video.videoId)
                  } else {
                    pendingVideoIdRef.current = video.videoId
                  }
                }}
              >
                <span className="youtube-playlist__number">{String(index + 1).padStart(2, '0')}</span>
                <img
                  src={`https://i.ytimg.com/vi/${video.videoId}/mqdefault.jpg`}
                  alt={`${thumbnailAltPrefix} ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                />
                <span className="youtube-playlist__video-copy">
                  <strong>{video.title || `${videoLabel} ${index + 1}`}</strong>
                  <small>{categoryLabel}</small>
                </span>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
