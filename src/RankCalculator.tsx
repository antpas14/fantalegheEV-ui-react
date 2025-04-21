import React, { useState } from 'react';
import { CalculateApi, Configuration, Rank } from '@antpas14/fantalegheev-api';
import './RankCalculator.css';

function RankCalculator() {
    const [selectedFile, setSelectedFile] = useState<Blob | null>(null);
    const [responseList, setResponseList] = useState<Rank[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleCalculate = async () => {
        if (!selectedFile) {
            setError('Please select a file.');
            return;
        }


        setLoading(true);
        setError(null);
        setResponseList([]);

        try {
            const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
            const configuration = new Configuration({
                basePath: apiBaseUrl,
            });
            const calculateApi = new CalculateApi(configuration);

            const response = await calculateApi.calculate({ file: selectedFile });
            setResponseList(response);
            setLoading(false);
        } catch (error: any) {
            setError(error.message || 'Calculation failed.');
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Calculate Rank</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleCalculate} disabled={!selectedFile || loading}>
                {loading ? 'Calculating...' : 'Calculate'}
            </button>

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {responseList.length > 0 && (
                <div>
                    <h3>Ranks:</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Team</th>
                            <th>EV Points</th>
                            <th>Points</th>
                        </tr>
                        </thead>
                        <tbody>
                        {responseList.map((rank) => (
                            <tr>
                                <td>{rank.team}</td>
                                <td>{rank.evPoints}</td>
                                <td>{rank.points}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default RankCalculator;