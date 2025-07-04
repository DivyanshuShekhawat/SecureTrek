import React, { useState, useEffect } from 'react';
import { CreditCard, AlertTriangle, CheckCircle, DollarSign, FileText } from 'lucide-react';

interface UsageBillingProps {
  fileSize: number;
  onPaymentComplete: () => void;
  onCancel: () => void;
}

export function UsageBilling({ fileSize, onPaymentComplete, onCancel }: UsageBillingProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [processing, setProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const formatFileSize = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return gb.toFixed(2) + ' GB';
  };

  const calculateCost = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    const baseRate = 0.10; // $0.10 per GB above 5GB
    const billableGB = Math.max(0, gb - 5);
    return (billableGB * baseRate).toFixed(2);
  };

  const cost = calculateCost(fileSize);
  const isLargeFile = fileSize > 5 * 1024 * 1024 * 1024; // 5GB

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setProcessing(false);
    onPaymentComplete();
  };

  if (!isLargeFile) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Large File Upload
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Files larger than 5GB require a small usage fee to cover storage costs.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">File Size:</span>
            <span className="font-medium text-gray-900 dark:text-white">{formatFileSize(fileSize)}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Free Allowance:</span>
            <span className="font-medium text-green-600 dark:text-green-400">5.00 GB</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">Billable Size:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatFileSize(Math.max(0, fileSize - 5 * 1024 * 1024 * 1024))}
            </span>
          </div>
          <hr className="border-gray-200 dark:border-gray-600 mb-3" />
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900 dark:text-white">Total Cost:</span>
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">${cost}</span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-lg border transition-colors ${
                  paymentMethod === 'card'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                }`}
              >
                <CreditCard className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm">Card</span>
              </button>
              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`p-3 rounded-lg border transition-colors ${
                  paymentMethod === 'paypal'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                }`}
              >
                <DollarSign className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm">PayPal</span>
              </button>
            </div>
          </div>

          {paymentMethod === 'card' && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Cardholder Name"
                value={cardDetails.name}
                onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              />
              <input
                type="text"
                placeholder="Card Number"
                value={cardDetails.number}
                onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>
            </div>
          )}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200 mb-1">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">Pricing Information</span>
          </div>
          <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <li>• First 5GB are always free</li>
            <li>• $0.10 per GB for additional storage</li>
            <li>• One-time payment per file</li>
            <li>• Secure payment processing</li>
          </ul>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={processing}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium text-sm flex items-center justify-center space-x-2"
          >
            {processing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Pay ${cost}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}