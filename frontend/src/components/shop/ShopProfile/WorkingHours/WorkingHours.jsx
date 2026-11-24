import React from 'react';
import styles from './WorkingHours.module.css';

const WorkingHours = ({ hoursData, setHoursData }) => {
    const toggleDay = (index) => {
        const newDays = [...hoursData];
        newDays[index] = { ...newDays[index], active: !newDays[index].active };
        setHoursData(newDays);
    };

    const updateTime = (index, field, value) => {
        const newDays = [...hoursData];
        newDays[index] = { ...newDays[index], [field]: value };
        setHoursData(newDays);
    };

    return (
        <div className={styles.workingHoursContainer}>
            <div className={styles.sectionHeader}>
                <span className={styles.icon}><i className="fa-solid fa-clock"></i></span>
                <h3>Working Hours</h3>
            </div>

            <div className={styles.hoursList}>
                {hoursData.map((day, index) => (
                    <div key={day.day} className={`${styles.hourRow} ${!day.active ? styles.inactive : ''}`}>
                        <span className={styles.dayName}>{day.label}</span>
                        <div className={styles.timeInputs}>
                            <input 
                                type="time" 
                                value={day.open_time} 
                                onChange={(e) => updateTime(index, 'open_time', e.target.value)}
                                disabled={!day.active} 
                            />
                            <span className={styles.to}>to</span>
                            <input 
                                type="time" 
                                value={day.close_time} 
                                onChange={(e) => updateTime(index, 'close_time', e.target.value)}
                                disabled={!day.active} 
                            />
                        </div>
                        <label className={styles.switch}>
                            <input type="checkbox" checked={day.active} onChange={() => toggleDay(index)} />
                            <span className={styles.slider}></span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkingHours;
