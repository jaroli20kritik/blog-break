import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;
    const [status, setStatus] = useState('pending'); // pending, method_selected, processing, success, failed, simulation, upi_qr
    const [selectedMethod, setSelectedMethod] = useState(''); // 'online', 'upi', 'cash'
    const [paymentId, setPaymentId] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState(null);

    if (!order) {
        return <div className="content loader-container">No order found. <button onClick={() => navigate('/menu')}>Go Menu</button></div>;
    }

    const initiatePayment = async (method) => {
        setStatus('processing');
        const apiMethod = method === 'online' ? 'MockRazorpay' : (method === 'upi' ? 'UPI' : 'Cash');
        
        try {
            const resp = await axios.post('http://localhost:5021/api/Payment/initiate', {
                orderId: order.id,
                paymentMethod: apiMethod
            });
            
            setPaymentId(resp.data.paymentId);
            
            if (method === 'online') {
                setTimeout(() => setStatus('simulation'), 1000);
            } else if (method === 'upi') {
                setTimeout(() => setStatus('upi_qr'), 500);
            } else if (method === 'cash') {
                // For cash, we mark it as success instantly to confirm the order flow, but it stays pending in DB for cashier.
                setTimeout(() => {
                    setPaymentDetails({ id: resp.data.paymentId, method: 'Cash' });
                    setStatus('success');
                }, 800);
            }
            
        } catch (err) {
            console.error(err);
            setStatus('pending');
            alert('Payment Initiation Failed');
        }
    };

    const confirmPayment = async () => {
        try {
            // Note: We deliberately skip calling /confirm here because 
            // the owner must manually verify all payments in the dashboard.
            setPaymentDetails({ id: paymentId, method: selectedMethod === 'upi' ? 'UPI' : 'MockRazorpay' });
            setStatus('success');
        } catch (err) {
            console.error(err);
            setStatus('failed');
        }
    };

    const failPayment = async () => {
        try {
            const resp = await axios.post(`http://localhost:5021/api/Payment/fail/${paymentId}`);
            setPaymentDetails(resp.data);
            setStatus('failed');
        } catch (err) {
            console.error(err);
            setStatus('failed');
        }
    };

    const closeGateway = () => {
        // Leaves it pending
        navigate('/track');
    };

    return (
        <div className="page-animate content loader-container" style={{ textAlign: 'center' }}>
            {status === 'pending' && (
                <>
                    <h2>Choose Payment Method</h2>
                    <p style={{marginBottom: '32px'}}>Amount Due: <strong style={{fontSize: '1.5rem', color: 'var(--primary-color)'}}>₹{order.totalAmount.toFixed(2)}</strong></p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '350px', margin: '0 auto', textAlign: 'left' }}>
                        <div 
                            style={{ padding: '15px', border: `2px solid ${selectedMethod === 'online' ? 'var(--primary-color)' : '#eee'}`, borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
                            onClick={() => setSelectedMethod('online')}
                        >
                            <input type="radio" checked={selectedMethod === 'online'} readOnly />
                            <div>
                                <h4 style={{margin: 0}}>Cards, NetBanking, Wallets</h4>
                                <small style={{color: 'var(--text-muted)'}}>via Razorpay Secure Gateway</small>
                            </div>
                        </div>

                        <div 
                            style={{ padding: '15px', border: `2px solid ${selectedMethod === 'upi' ? 'var(--primary-color)' : '#eee'}`, borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
                            onClick={() => setSelectedMethod('upi')}
                        >
                            <input type="radio" checked={selectedMethod === 'upi'} readOnly />
                            <div>
                                <h4 style={{margin: 0}}>UPI QR Code Scan</h4>
                                <small style={{color: 'var(--text-muted)'}}>Pay via GPay, PhonePe, Paytm</small>
                            </div>
                        </div>

                        <div 
                            style={{ padding: '15px', border: `2px solid ${selectedMethod === 'cash' ? 'var(--primary-color)' : '#eee'}`, borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
                            onClick={() => setSelectedMethod('cash')}
                        >
                            <input type="radio" checked={selectedMethod === 'cash'} readOnly />
                            <div>
                                <h4 style={{margin: 0}}>Cash at Counter</h4>
                                <small style={{color: 'var(--text-muted)'}}>Pay directly to the cashier</small>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <button 
                            className="btn btn-primary" 
                            disabled={!selectedMethod}
                            onClick={() => initiatePayment(selectedMethod)}
                        >
                            Proceed to Pay
                        </button>
                    </div>
                </>
            )}

            {status === 'processing' && (
                <>
                    <div className="spinner"></div>
                    <h2>Loading Gateway...</h2>
                    <p>Please do not close this window.</p>
                </>
            )}

            {status === 'simulation' && (
                <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                    <h2>Mock Razorpay Gateway</h2>
                    <p style={{marginBottom: '20px'}}>Amount to pay: <strong>₹{order.totalAmount.toFixed(2)}</strong></p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px', margin: '0 auto' }}>
                        <button className="btn btn-primary" style={{background: '#1dd1a1', border: 'none'}} onClick={confirmPayment}>
                            Simulate Success
                        </button>
                        <button className="btn btn-primary" style={{background: '#ff6b6b', border: 'none'}} onClick={failPayment}>
                            Simulate Failure
                        </button>
                        <button className="btn btn-outline" style={{border: '1px solid #ccc', color: '#555'}} onClick={closeGateway}>
                            Cancel (Leave Pending)
                        </button>
                    </div>
                </div>
            )}

            {status === 'upi_qr' && (
                <div className="page-animate">
                    <h2>Scan to Pay</h2>
                    <p style={{marginBottom: '10px'}}>Amount Due: <strong style={{fontSize: '1.3rem', color: 'var(--primary-color)'}}>₹{order.totalAmount.toFixed(2)}</strong></p>
                    <div style={{ border: '2px dashed #ccc', padding: '20px', display: 'inline-block', borderRadius: '16px', background: '#fff', marginBottom: '20px' }}>
                        <img src="/mock_qr.png" alt="UPI QR Code" style={{ width: '200px', height: '200px', objectFit: 'contain' }} />
                    </div>
                    <p style={{color: 'var(--text-muted)', marginBottom: '30px'}}>Scan with any UPI App (Mock)</p>

                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <button className="btn btn-primary" style={{background: '#1dd1a1', border: 'none', width: 'auto'}} onClick={confirmPayment}>
                            ✓ Simulate Scanned
                        </button>
                        <button className="btn btn-outline" style={{width: 'auto'}} onClick={closeGateway}>
                            Cancel Option
                        </button>
                    </div>
                </div>
            )}

            {status === 'success' && (
                <>
                    <div style={{fontSize: '64px', color: '#1dd1a1', marginBottom: '16px'}}>✓</div>
                    <h2>{paymentDetails?.method === 'Cash' ? 'Order Confirmed!' : 'Payment Successful!'}</h2>
                    <p>Order #{order.id} is now being prepared.</p>
                    {paymentDetails?.method === 'Cash' ? (
                        <p style={{marginTop: '20px', color: '#d35400', fontWeight: 'bold'}}>Please pay ₹{order.totalAmount.toFixed(2)} at the counter.</p>
                    ) : (
                        <p style={{marginTop: '20px', color: 'var(--text-muted)'}}>Payment Ref: #{paymentDetails?.id}</p>
                    )}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '32px', justifyContent: 'center' }}>
                        <button className="btn btn-primary" style={{width: 'auto'}} onClick={() => navigate('/track')}>Track Order</button>
                        <button className="btn btn-outline" style={{width: 'auto'}} onClick={() => navigate('/menu')}>Order More</button>
                    </div>
                </>
            )}

            {status === 'failed' && (
                <>
                    <div style={{fontSize: '64px', color: '#ff6b6b', marginBottom: '16px'}}>✗</div>
                    <h2>Payment Failed</h2>
                    <p>There was an issue processing your payment.</p>
                    <p style={{marginTop: '20px', color: 'var(--text-muted)'}}>Payment Ref: #{paymentDetails?.id}</p>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '32px', justifyContent: 'center' }}>
                        <button className="btn btn-primary" style={{width: 'auto'}} onClick={() => navigate('/cart')}>Try Again</button>
                        <button className="btn btn-outline" style={{width: 'auto'}} onClick={() => navigate('/track')}>View Order Details</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default PaymentPage;
