import React, { useState } from 'react';
import FontAwesome from 'react-fontawesome';
import cx from 'classnames';
import _ from 'lodash';
import { Button } from 'semantic-ui-react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { TrackRow } from '@nuclear/ui';

import TrackPopupContainer from '../../../containers/TrackPopupContainer';
import artPlaceholder from '../../../../resources/media/art_placeholder.png';

import trackRowStyles from '../../TrackRow/styles.scss';
import styles from './styles.scss';
import { Track } from '@nuclear/core';

type AddAllButtonProps = {
  handleAddAll: React.MouseEventHandler;
  t: TFunction;
}

const AddAllButton: React.FC<AddAllButtonProps> = ({
  handleAddAll,
  t
}) => {
  return (
    <Button
      primary
      href='#'
      onClick={handleAddAll}
      className={styles.add_button}
      aria-label={t('queue')}
    >
      <FontAwesome name='plus' /> Add all
    </Button>
  );
};

type PopularTracksProps = {
  artist: {
    name: string;
  };
  tracks: Track[];
  addToQueue: (track) => Promise<void> ;
}

const PopularTracks: React.FC<PopularTracksProps> = ({
  artist,
  tracks,
  addToQueue
}) => {
  const { t } = useTranslation('artist');
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded(!expanded);
  const handleAddAll = () => {
    tracks
      // Change of WildLeons
      // Old version : .slice(0, expanded ? 15 : 5)
      .slice(0, tracks.length > 15 ? 15 : tracks.length)
      .map(track => {
        addToQueue({
          artist: artist.name,
          name: track.title,
          thumbnail: track.thumbnail || artPlaceholder
        });
      });
  };

  return (
    !_.isEmpty(tracks) &&
      <div className={cx(
        styles.popular_tracks_container,
        trackRowStyles.tracks_container
      )}>
        <div className={styles.header}>Popular tracks </div>
        <AddAllButton 
          handleAddAll={handleAddAll}
          t={t}
        />
        <table className={styles.popular_tracks_table}>
          <thead>
            <tr>
              <th>
                <FontAwesome name='photo' />
              </th>
              <th>{t('title')}</th>
              <th>{t('count')}</th>
            </tr>
          </thead>
          <tbody>
            {
              tracks
                .slice(0, expanded ? 15 : 5)
                .map((track, index) => (
                  <TrackPopupContainer
                    key={'popular-track-row-' + index}
                    trigger={
                      <TrackRow
                        track={{
                          playcount: _.get(track, 'playcount'),
                          name: track.title,
                          thumbnail: track.thumbnail
                        }}
                        displayCover
                        displayPlayCount
                      />
                    }
                    title={track.title}
                    track={track}
                    artist={artist.name}
                  />
                ))
            }
          </tbody>
        </table>
        <div className='expand_button' onClick={toggleExpand}>
          <FontAwesome
            name={expanded ? 'angle-double-up' : 'angle-double-down'}
          />
        </div>
      </div>
  );
};

export default PopularTracks;
