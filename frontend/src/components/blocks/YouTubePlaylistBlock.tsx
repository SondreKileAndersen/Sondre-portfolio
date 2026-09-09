import { useEffect, useId, useState } from 'react'
import type { YouTubePlaylistSection } from '../../types/page'

type YouTubePlayer = {
  destroy: () => void
  getIframe: () => HTMLIFrameElement
  getPlaylist: () => string[] | undefined
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
  heading,
  introduction,
  playlistId,
  playlistUrl,
  iframeTitle,
  firstVideoId,
  firstVideoTitle,
  listHeading,
  videoLabel,
  thumbnailAltPrefix,
  openPlaylistLabel,
}: YouTubePlaylistSection) {
  const reactId = useId()
  const playerId = `youtube-playlist-${reactId.replace(/:/g, '')}`
  const [videoIds, setVideoIds] = useState<string[]>([firstVideoId])

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
            event.target.getIframe().title = iframeTitle
            const playlistVideos = event.target.getPlaylist()
            if (playlistVideos?.length) setVideoIds(playlistVideos)
          },
        },
      })
    })

    return () => {
      cancelled = true
      player?.destroy()
    }
  }, [firstVideoId, iframeTitle, playerId, playlistId])

  const remainingVideos = videoIds.filter((videoId) => videoId !== firstVideoId)

  return (
    <section className="youtube-playlist">
      <header className="youtube-playlist__header">
        <h3>{heading}</h3>
        <p>{introduction}</p>
      </header>
      <div className="youtube-playlist__layout">
        <div className="youtube-playlist__featured">
          <div className="youtube-playlist__player">
            <div id={playerId} />
          </div>
          <h4>{firstVideoTitle}</h4>
        </div>
        <aside className="youtube-playlist__queue">
          <h4>{listHeading}</h4>
          <div className="youtube-playlist__videos">
            {remainingVideos.map((videoId, index) => (
              <a
                key={videoId}
                href={`https://www.youtube.com/watch?v=${videoId}&list=${playlistId}`}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`}
                  alt={`${thumbnailAltPrefix} ${index + 2}`}
                />
                <span>{videoLabel} {index + 2}</span>
              </a>
            ))}
          </div>
          <a
            className="youtube-playlist__link"
            href={playlistUrl}
            target="_blank"
            rel="noreferrer"
          >
            {openPlaylistLabel} <span aria-hidden="true">↗</span>
          </a>
        </aside>
      </div>
    </section>
  )
}
